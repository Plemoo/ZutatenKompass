/// <reference types="jest" />

import {
  bundledRecipeCatalog,
  createBundledRecipeRepository,
} from "../../src/data";

describe("bundled recipe catalog", () => {
  it("contains the promised catalog size with stable unique ids", () => {
    expect(bundledRecipeCatalog.recipes.length).toBeGreaterThanOrEqual(500);
    expect(new Set(bundledRecipeCatalog.recipes.map(({ id }) => id)).size).toBe(
      bundledRecipeCatalog.recipes.length,
    );
    expect(
      new Set(bundledRecipeCatalog.ingredients.map(({ id }) => id)).size,
    ).toBe(bundledRecipeCatalog.ingredients.length);
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
});
