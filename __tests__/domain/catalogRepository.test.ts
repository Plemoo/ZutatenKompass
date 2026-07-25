/// <reference types="jest" />

import {
  bundledRecipeCatalog,
  createBundledRecipeRepository,
} from "../../src/data";

describe("bundled recipe catalog", () => {
  it("contains the promised catalog size with stable unique ids", () => {
    expect(bundledRecipeCatalog.recipes.length).toBeGreaterThanOrEqual(1290);
    expect(new Set(bundledRecipeCatalog.recipes.map(({ id }) => id)).size).toBe(
      bundledRecipeCatalog.recipes.length,
    );
    expect(
      new Set(bundledRecipeCatalog.ingredients.map(({ id }) => id)).size,
    ).toBe(bundledRecipeCatalog.ingredients.length);
  });

  it("contains substantial cooking and baking collections", () => {
    const byMethod = (method: string) =>
      bundledRecipeCatalog.recipes.filter(({ facetOptionIds }) =>
        facetOptionIds.includes(method),
      );

    expect(byMethod("method-casserole").length).toBeGreaterThanOrEqual(150);
    expect(byMethod("method-stew").length).toBeGreaterThanOrEqual(150);
    expect(byMethod("method-baking").length).toBeGreaterThanOrEqual(300);
  });

  it("contains 90 distinct lunch recipes for oven, pot and pan", () => {
    for (const method of ["oven", "pot", "pan"]) {
      const concepts = new Set(
        bundledRecipeCatalog.recipes
          .filter(
            ({ id, facetOptionIds }) =>
              id.startsWith(`lunch-${method}-`) &&
              facetOptionIds.includes("meal-lunch") &&
              facetOptionIds.includes(`method-${method}`),
          )
          .map(({ baseRecipeId }) => baseRecipeId),
      );
      expect(concepts.size).toBeGreaterThanOrEqual(30);
      expect(
        new Set(
          bundledRecipeCatalog.recipes
            .filter(({ id }) => id.startsWith(`lunch-${method}-`))
            .map(({ techniqueSignature }) => techniqueSignature),
        ).size,
      ).toBeGreaterThanOrEqual(10);
    }
  });

  it("contains complete German and English recipe content", () => {
    for (const recipe of bundledRecipeCatalog.recipes) {
      expect(recipe.title.de.length).toBeGreaterThan(0);
      expect(recipe.title.en.length).toBeGreaterThan(0);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(3);
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(6);
      expect(recipe.totalMinutes).toBe(recipe.prepMinutes + recipe.cookMinutes);
      for (const step of recipe.steps) {
        expect(step.de.length).toBeGreaterThan(30);
        expect(step.en.length).toBeGreaterThan(30);
      }
    }
  });

  it("exposes every ingredient and facet referenced by a recipe", () => {
    const ingredientIds = new Set(
      bundledRecipeCatalog.ingredients.map(({ id }) => id),
    );
    const optionIds = new Set(
      bundledRecipeCatalog.facets.flatMap(({ options }) =>
        options.map(({ id }) => id),
      ),
    );
    for (const recipe of bundledRecipeCatalog.recipes) {
      for (const line of recipe.ingredients) {
        expect(ingredientIds.has(line.ingredientId)).toBe(true);
      }
      for (const id of recipe.facetOptionIds) {
        expect(optionIds.has(id)).toBe(true);
      }
    }
  });
});

describe("BundledRecipeRepository", () => {
  const repository = createBundledRecipeRepository();

  it("returns the catalog and recipes by stable id", () => {
    expect(repository.getCatalog()).toBe(bundledRecipeCatalog);
    const first = bundledRecipeCatalog.recipes[0]!;
    expect(repository.getRecipeById(first.id)).toBe(first);
    expect(repository.getRecipeById("missing")).toBeUndefined();
  });

  it("resolves aliases and suggests typos through one facade", () => {
    const alias = repository.resolveIngredient("Möhre", "de");
    expect(alias.status).toBe("resolved");
    if (alias.status === "resolved") expect(alias.ingredient.id).toBe("carrot");

    expect(
      repository.suggestIngredients("Kichererbsee", "de")[0]?.ingredient.id,
    ).toBe("chickpea");
  });

  it("searches the real catalog using generic ingredients and facets", () => {
    const result = repository.search({
      includeIngredientIds: ["cheese", "vegetable"],
      excludeIngredientIds: ["meat", "seafood"],
      facets: [
        { groupId: "diet", optionIds: ["diet-vegetarian"] },
        {
          groupId: "method",
          optionIds: ["method-bowl", "method-salad"],
        },
      ],
      locale: "de",
    });
    expect(result.total).toBeGreaterThan(0);
    expect(
      result.matches.every(({ recipe }) =>
        recipe.facetOptionIds.includes("diet-vegetarian"),
      ),
    ).toBe(true);
  });

  it("returns every base recipe at most once and collapses oven potato variants", () => {
    const result = repository.search({
      includeIngredientIds: ["potato"],
      excludeIngredientIds: [],
      facets: [],
      locale: "de",
    });
    const baseIds = result.matches.map(({ recipe }) => recipe.baseRecipeId);

    expect(new Set(baseIds).size).toBe(baseIds.length);
    expect(baseIds.filter((id) => id === "base-tray")).toHaveLength(1);
  });
});
