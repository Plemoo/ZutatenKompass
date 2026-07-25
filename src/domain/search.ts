import type {
  FacetSelection,
  IngredientConcept,
  IngredientHighlight,
  Recipe,
  RecipeCatalog,
  RecipeMatch,
  RecipeSearchQuery,
  RecipeSearchResult,
} from "./models";

interface SearchIndex {
  readonly ingredientById: ReadonlyMap<string, IngredientConcept>;
  readonly childrenById: ReadonlyMap<string, readonly string[]>;
  readonly facetOptionIds: ReadonlySet<string>;
  readonly facetGroupByOptionId: ReadonlyMap<string, string>;
  readonly facetChildrenById: ReadonlyMap<string, readonly string[]>;
}

function createIndex(catalog: RecipeCatalog): SearchIndex {
  const ingredientById = new Map(
    catalog.ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );
  const mutableChildren = new Map<string, string[]>();
  for (const ingredient of catalog.ingredients) {
    if (!ingredient.parentId) continue;
    const children = mutableChildren.get(ingredient.parentId) ?? [];
    children.push(ingredient.id);
    mutableChildren.set(ingredient.parentId, children);
  }
  const facetOptions = catalog.facets.flatMap((group) => group.options);
  const mutableFacetChildren = new Map<string, string[]>();
  for (const option of facetOptions) {
    if (!option.parentId) continue;
    const children = mutableFacetChildren.get(option.parentId) ?? [];
    children.push(option.id);
    mutableFacetChildren.set(option.parentId, children);
  }
  return {
    ingredientById,
    childrenById: mutableChildren,
    facetOptionIds: new Set(facetOptions.map((option) => option.id)),
    facetGroupByOptionId: new Map(
      facetOptions.map((option) => [option.id, option.groupId]),
    ),
    facetChildrenById: mutableFacetChildren,
  };
}

function descendantsOf(id: string, index: SearchIndex): ReadonlySet<string> {
  const result = new Set<string>([id]);
  const pending = [...(index.childrenById.get(id) ?? [])];
  while (pending.length > 0) {
    const childId = pending.pop()!;
    if (result.has(childId)) continue;
    result.add(childId);
    pending.push(...(index.childrenById.get(childId) ?? []));
  }
  return result;
}

function facetDescendantsOf(
  id: string,
  index: SearchIndex,
): ReadonlySet<string> {
  const result = new Set<string>([id]);
  const pending = [...(index.facetChildrenById.get(id) ?? [])];
  while (pending.length > 0) {
    const childId = pending.pop()!;
    if (result.has(childId)) continue;
    result.add(childId);
    pending.push(...(index.facetChildrenById.get(childId) ?? []));
  }
  return result;
}

function ingredientHighlights(
  recipe: Recipe,
  includeIds: readonly string[],
  index: SearchIndex,
): readonly IngredientHighlight[] | undefined {
  const recipeIngredientIds = new Set(
    recipe.ingredients.map((ingredient) => ingredient.ingredientId),
  );
  const highlights = includeIds.map((requestedIngredientId) => {
    const accepted = descendantsOf(requestedIngredientId, index);
    return {
      requestedIngredientId,
      matchedRecipeIngredientIds: [...recipeIngredientIds]
        .filter((id) => accepted.has(id))
        .sort(),
    };
  });
  return highlights.every(
    (highlight) => highlight.matchedRecipeIngredientIds.length > 0,
  )
    ? highlights
    : undefined;
}

function isHardExcluded(
  recipe: Recipe,
  excludeIds: readonly string[],
  index: SearchIndex,
): boolean {
  const excluded = new Set(
    excludeIds.flatMap((ingredientId) => [
      ...descendantsOf(ingredientId, index),
    ]),
  );
  return recipe.ingredients.some((ingredient) =>
    excluded.has(ingredient.ingredientId),
  );
}

function matchesFacets(
  recipe: Recipe,
  facets: readonly FacetSelection[],
  index: SearchIndex,
): boolean {
  const recipeOptions = new Set(recipe.facetOptionIds);
  return facets.every(
    (selection) =>
      selection.optionIds.length === 0 ||
      selection.optionIds.some((optionId) =>
        [...facetDescendantsOf(optionId, index)].some((acceptedId) =>
          recipeOptions.has(acceptedId),
        ),
      ),
  );
}

function toMatch(
  recipe: Recipe,
  highlights: readonly IngredientHighlight[],
  query: RecipeSearchQuery,
  index: SearchIndex,
): RecipeMatch {
  const matchedIds = new Set(
    highlights.flatMap((highlight) => highlight.matchedRecipeIngredientIds),
  );
  const additionalIngredientIds = recipe.ingredients
    .map((ingredient) => ingredient.ingredientId)
    .filter((id) => !matchedIds.has(id));
  const additionalWeight = additionalIngredientIds.reduce(
    (sum, id) =>
      sum + (index.ingredientById.get(id)?.isPantryStaple ? 0.25 : 1),
    0,
  );
  const exactMatches = highlights.filter((highlight) =>
    highlight.matchedRecipeIngredientIds.includes(
      highlight.requestedIngredientId,
    ),
  ).length;
  const selectedFacetIds = new Set(
    query.facets.flatMap((selection) =>
      selection.optionIds
        .filter(
          (id) => index.facetGroupByOptionId.get(id) === selection.groupId,
        )
        .flatMap((id) => [...facetDescendantsOf(id, index)]),
    ),
  );
  const facetOptionIds = recipe.facetOptionIds.filter((id) =>
    selectedFacetIds.has(id),
  );

  return {
    recipe,
    score: Math.round(
      10_000 +
        highlights.length * 500 +
        exactMatches * 50 +
        facetOptionIds.length * 25 -
        additionalWeight * 100 -
        recipe.totalMinutes,
    ),
    additionalIngredientIds,
    highlights: { ingredients: highlights, facetOptionIds },
  };
}

export function searchRecipes(
  query: RecipeSearchQuery,
  catalog: RecipeCatalog,
): RecipeSearchResult {
  const index = createIndex(catalog);
  const includeIds = [...new Set(query.includeIngredientIds)];
  const excludeIds = [...new Set(query.excludeIngredientIds)];
  const unknownIncludeIngredientIds = includeIds.filter(
    (id) => !index.ingredientById.has(id),
  );
  const unknownExcludeIngredientIds = excludeIds.filter(
    (id) => !index.ingredientById.has(id),
  );
  const unknownFacetOptionIds = [
    ...new Set(query.facets.flatMap((selection) => selection.optionIds)),
  ].filter(
    (id) =>
      !index.facetOptionIds.has(id) ||
      !query.facets.some(
        (selection) =>
          selection.optionIds.includes(id) &&
          index.facetGroupByOptionId.get(id) === selection.groupId,
      ),
  );

  if (unknownIncludeIngredientIds.length > 0) {
    return {
      matches: [],
      total: 0,
      unknownIncludeIngredientIds,
      unknownExcludeIngredientIds,
      unknownFacetOptionIds,
    };
  }

  const knownExcludes = excludeIds.filter((id) => index.ingredientById.has(id));
  const knownFacets = query.facets.map((selection) => ({
    ...selection,
    optionIds: selection.optionIds.filter(
      (id) => index.facetGroupByOptionId.get(id) === selection.groupId,
    ),
  }));

  const rankedMatches = catalog.recipes
    .flatMap((recipe): RecipeMatch[] => {
      const highlights = ingredientHighlights(recipe, includeIds, index);
      if (!highlights) return [];
      if (isHardExcluded(recipe, knownExcludes, index)) return [];
      if (!matchesFacets(recipe, knownFacets, index)) return [];
      return [toMatch(recipe, highlights, query, index)];
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.recipe.title[query.locale].localeCompare(
          b.recipe.title[query.locale],
          query.locale,
        ) ||
        a.recipe.id.localeCompare(b.recipe.id),
    );
  const visibleBaseRecipeIds = new Set<string>();
  const matches = rankedMatches.filter(({ recipe }) => {
    if (visibleBaseRecipeIds.has(recipe.baseRecipeId)) return false;
    visibleBaseRecipeIds.add(recipe.baseRecipeId);
    return true;
  });

  return {
    matches,
    total: matches.length,
    unknownIncludeIngredientIds,
    unknownExcludeIngredientIds,
    unknownFacetOptionIds,
  };
}
