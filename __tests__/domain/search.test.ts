/// <reference types="jest" />

import {
  searchRecipes,
  type IngredientConcept,
  type Recipe,
  type RecipeCatalog,
  type RecipeSearchQuery,
} from "../../src/domain";

const concept = (
  id: string,
  parentId?: string,
  staple = false,
): IngredientConcept => ({
  id,
  name: { de: id, en: id },
  aliases: { de: [], en: [] },
  ...(parentId ? { parentId } : {}),
  isPantryStaple: staple,
});

const ingredients = [
  concept("cheese"),
  concept("cheddar", "cheese"),
  concept("feta", "cheese"),
  concept("vegetable"),
  concept("tomato", "vegetable"),
  concept("zucchini", "vegetable"),
  concept("rice"),
  concept("salt", undefined, true),
  concept("chicken"),
];

const recipe = (
  id: string,
  ingredientIds: readonly string[],
  facetOptionIds: readonly string[],
  totalMinutes: number,
): Recipe => ({
  id,
  title: { de: id, en: id },
  servings: 4,
  prepMinutes: 10,
  cookMinutes: totalMinutes - 10,
  totalMinutes,
  difficulty: "easy",
  ingredients: ingredientIds.map((ingredientId) => ({
    ingredientId,
    amount: 1,
    unit: { de: "Stück", en: "piece" },
  })),
  steps: [
    {
      de: "Alles sorgfältig vorbereiten.",
      en: "Prepare everything carefully.",
    },
    { de: "Alles vollständig garen.", en: "Cook everything thoroughly." },
    { de: "Abschmecken und servieren.", en: "Season and serve." },
  ],
  facetOptionIds,
});

const catalog: RecipeCatalog = {
  version: 1,
  ingredients,
  facets: [
    {
      id: "diet",
      label: { de: "Ernährung", en: "Diet" },
      options: [
        {
          id: "diet-vegetarian",
          groupId: "diet",
          label: { de: "Vegetarisch", en: "Vegetarian" },
        },
        {
          id: "diet-omnivore",
          groupId: "diet",
          label: { de: "Omnivor", en: "Omnivore" },
        },
      ],
    },
    {
      id: "time",
      label: { de: "Zeit", en: "Time" },
      options: [
        {
          id: "time-any",
          groupId: "time",
          label: { de: "Beliebig", en: "Any" },
        },
        {
          id: "time-fast",
          groupId: "time",
          label: { de: "Schnell", en: "Fast" },
          parentId: "time-any",
        },
        {
          id: "time-slow",
          groupId: "time",
          label: { de: "Langsam", en: "Slow" },
          parentId: "time-any",
        },
      ],
    },
  ],
  recipes: [
    recipe(
      "tomato-cheddar-rice",
      ["tomato", "cheddar", "rice", "salt"],
      ["diet-vegetarian", "time-fast"],
      25,
    ),
    recipe(
      "zucchini-feta-rice",
      ["zucchini", "feta", "rice", "salt"],
      ["diet-vegetarian", "time-slow"],
      50,
    ),
    recipe(
      "chicken-tomato-rice",
      ["chicken", "tomato", "rice", "salt"],
      ["diet-omnivore", "time-fast"],
      30,
    ),
    recipe(
      "minimal-cheddar",
      ["cheddar", "salt"],
      ["diet-vegetarian", "time-fast"],
      20,
    ),
  ],
};

const query = (
  overrides: Partial<RecipeSearchQuery> = {},
): RecipeSearchQuery => ({
  includeIngredientIds: [],
  excludeIngredientIds: [],
  facets: [],
  locale: "de",
  ...overrides,
});

describe("searchRecipes", () => {
  it("uses AND semantics for included ingredients", () => {
    const result = searchRecipes(
      query({ includeIngredientIds: ["tomato", "cheese"] }),
      catalog,
    );
    expect(result.matches.map((match) => match.recipe.id)).toEqual([
      "tomato-cheddar-rice",
    ]);
  });

  it("matches a generic ingredient against descendants", () => {
    const result = searchRecipes(
      query({ includeIngredientIds: ["cheese"] }),
      catalog,
    );
    expect(result.matches.map((match) => match.recipe.id)).toEqual([
      "minimal-cheddar",
      "tomato-cheddar-rice",
      "zucchini-feta-rice",
    ]);
    expect(result.matches[0]?.highlights.ingredients[0]).toEqual({
      requestedIngredientId: "cheese",
      matchedRecipeIngredientIds: ["cheddar"],
    });
  });

  it("applies generic excludes to every descendant", () => {
    const result = searchRecipes(
      query({ excludeIngredientIds: ["cheese"] }),
      catalog,
    );
    expect(result.matches.map((match) => match.recipe.id)).toEqual([
      "chicken-tomato-rice",
    ]);
  });

  it("lets hard excludes win over included ingredients", () => {
    const result = searchRecipes(
      query({
        includeIngredientIds: ["cheese"],
        excludeIngredientIds: ["cheddar"],
      }),
      catalog,
    );
    expect(result.matches.map((match) => match.recipe.id)).toEqual([
      "zucchini-feta-rice",
    ]);
  });

  it("uses OR within one facet group", () => {
    const result = searchRecipes(
      query({
        facets: [
          {
            groupId: "time",
            optionIds: ["time-fast", "time-slow"],
          },
        ],
      }),
      catalog,
    );
    expect(result.total).toBe(4);
  });

  it("uses AND between different facet groups", () => {
    const result = searchRecipes(
      query({
        facets: [
          { groupId: "diet", optionIds: ["diet-vegetarian"] },
          { groupId: "time", optionIds: ["time-slow"] },
        ],
      }),
      catalog,
    );
    expect(result.matches.map((match) => match.recipe.id)).toEqual([
      "zucchini-feta-rice",
    ]);
  });

  it("matches a parent facet against recipes tagged with descendants", () => {
    const result = searchRecipes(
      query({
        facets: [{ groupId: "time", optionIds: ["time-any"] }],
      }),
      catalog,
    );
    expect(result.total).toBe(4);
    expect(result.matches[0]?.highlights.facetOptionIds).toContain("time-fast");
  });

  it("ranks fewer additional ingredients above otherwise valid recipes", () => {
    const result = searchRecipes(
      query({ includeIngredientIds: ["cheese"] }),
      catalog,
    );
    expect(result.matches[0]?.recipe.id).toBe("minimal-cheddar");
    expect(result.matches[0]?.additionalIngredientIds).toEqual(["salt"]);
  });

  it("discounts pantry staples but still reports them as additional", () => {
    const result = searchRecipes(
      query({ includeIngredientIds: ["tomato", "cheese", "rice"] }),
      catalog,
    );
    expect(result.matches[0]?.additionalIngredientIds).toEqual(["salt"]);
    expect(result.matches[0]?.score).toBeGreaterThan(11_000);
  });

  it("returns highlight metadata for selected facets and ingredients", () => {
    const result = searchRecipes(
      query({
        includeIngredientIds: ["vegetable", "cheese"],
        facets: [{ groupId: "time", optionIds: ["time-fast"] }],
      }),
      catalog,
    );
    expect(result.matches[0]?.highlights).toEqual({
      ingredients: [
        {
          requestedIngredientId: "vegetable",
          matchedRecipeIngredientIds: ["tomato"],
        },
        {
          requestedIngredientId: "cheese",
          matchedRecipeIngredientIds: ["cheddar"],
        },
      ],
      facetOptionIds: ["time-fast"],
    });
  });

  it("reports unknown include ids and fails closed", () => {
    const result = searchRecipes(
      query({ includeIngredientIds: ["does-not-exist"] }),
      catalog,
    );
    expect(result.matches).toEqual([]);
    expect(result.unknownIncludeIngredientIds).toEqual(["does-not-exist"]);
  });

  it("reports unknown excludes and facets but ignores them safely", () => {
    const result = searchRecipes(
      query({
        includeIngredientIds: ["tomato"],
        excludeIngredientIds: ["unknown-exclude"],
        facets: [{ groupId: "unknown", optionIds: ["unknown-facet"] }],
      }),
      catalog,
    );
    expect(result.total).toBe(2);
    expect(result.unknownExcludeIngredientIds).toEqual(["unknown-exclude"]);
    expect(result.unknownFacetOptionIds).toEqual(["unknown-facet"]);
  });

  it("rejects a known facet option assigned to the wrong group", () => {
    const result = searchRecipes(
      query({
        facets: [{ groupId: "diet", optionIds: ["time-fast"] }],
      }),
      catalog,
    );
    expect(result.total).toBe(4);
    expect(result.unknownFacetOptionIds).toEqual(["time-fast"]);
  });

  it("deduplicates repeated include criteria", () => {
    const once = searchRecipes(
      query({ includeIngredientIds: ["tomato"] }),
      catalog,
    );
    const repeated = searchRecipes(
      query({ includeIngredientIds: ["tomato", "tomato"] }),
      catalog,
    );
    expect(repeated.matches.map((match) => match.score)).toEqual(
      once.matches.map((match) => match.score),
    );
  });
});
