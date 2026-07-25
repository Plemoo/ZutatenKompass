import { createBundledRecipeRepository } from "../../data";
import type {
  FacetGroup,
  FacetSelection,
  IngredientConcept,
  Locale,
  Recipe,
  RecipeMatch,
} from "../../domain";
import type { FacetViewGroup } from "../search/FacetFilters";
import type { IngredientCandidate } from "../search/IngredientInput";

const repository = createBundledRecipeRepository();

export function getCatalog() {
  return repository.getCatalog();
}

export function getRecipe(id: string): Recipe | undefined {
  return repository.getRecipeById(id);
}

export function getIngredient(id: string): IngredientConcept | undefined {
  return getCatalog().ingredients.find((ingredient) => ingredient.id === id);
}

export function ingredientLabel(id: string, locale: Locale): string {
  return getIngredient(id)?.name[locale] ?? id;
}

export function suggestIngredientCandidates(
  query: string,
  locale: Locale,
): readonly IngredientCandidate[] {
  const resolution = repository.resolveIngredient(query, locale);
  if (resolution.status === "resolved") {
    return [
      {
        id: resolution.ingredient.id,
        label: resolution.ingredient.name[locale],
        resolved: true,
      },
    ];
  }
  const suggestions =
    resolution.status === "ambiguous"
      ? resolution.candidates.map((ingredient) => ({ ingredient }))
      : resolution.suggestions;
  return suggestions.map(({ ingredient }) => ({
    id: ingredient.id,
    label: ingredient.name[locale],
  }));
}

export function facetGroups(locale: Locale): readonly FacetViewGroup[] {
  return getCatalog().facets.map((group: FacetGroup) => ({
    id: group.id,
    label: group.label[locale],
    options: group.options.map((option) => ({
      id: option.id,
      label: option.label[locale],
      ...(option.parentId ? { parentId: option.parentId } : {}),
    })),
  }));
}

function groupFacetIds(selectedIds: readonly string[]): FacetSelection[] {
  const selected = new Set(selectedIds);
  return getCatalog().facets.flatMap((group) => {
    const optionIds = group.options
      .map(({ id }) => id)
      .filter((id) => selected.has(id));
    return optionIds.length ? [{ groupId: group.id, optionIds }] : [];
  });
}

export function findRecipes(
  includeIngredientIds: readonly string[],
  excludeIngredientIds: readonly string[],
  selectedFacetIds: readonly string[],
  locale: Locale,
): readonly RecipeMatch[] {
  return repository.search({
    includeIngredientIds,
    excludeIngredientIds,
    facets: groupFacetIds(selectedFacetIds),
    locale,
  }).matches;
}

export function allRecipes(): readonly Recipe[] {
  return getCatalog().recipes;
}

export function facetLabel(id: string, locale: Locale): string {
  for (const group of getCatalog().facets) {
    const option = group.options.find((candidate) => candidate.id === id);
    if (option) return option.label[locale];
  }
  return id;
}
