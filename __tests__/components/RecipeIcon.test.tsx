import { bundledRecipeCatalog } from "../../src/data";
import { getRecipeIconPresentation } from "../../src/features/recipes/RecipeIcon";

function recipeWithBase(baseRecipeId: string) {
  const recipe = bundledRecipeCatalog.recipes.find(
    (candidate) => candidate.baseRecipeId === baseRecipeId,
  );
  if (!recipe) throw new Error(`Missing test recipe ${baseRecipeId}`);
  return recipe;
}

describe("recipe icon presentation", () => {
  it("uses recognizable primary icons for established dish families", () => {
    expect(getRecipeIconPresentation(recipeWithBase("base-soup")).icon).toBe(
      "pot-steam-outline",
    );
    expect(getRecipeIconPresentation(recipeWithBase("base-pasta")).icon).toBe(
      "pasta",
    );
    expect(getRecipeIconPresentation(recipeWithBase("base-cake")).icon).toBe(
      "cake-variant-outline",
    );
    expect(getRecipeIconPresentation(recipeWithBase("base-tray")).icon).toBe(
      "toaster-oven",
    );
  });

  it("keeps one explicit visual kind across every variant of a base recipe", () => {
    const kindsByBase = new Map<string, Set<string>>();
    for (const recipe of bundledRecipeCatalog.recipes) {
      const kinds = kindsByBase.get(recipe.baseRecipeId) ?? new Set<string>();
      kinds.add(recipe.visualKind);
      kindsByBase.set(recipe.baseRecipeId, kinds);
    }

    expect([...kindsByBase.values()].every((kinds) => kinds.size === 1)).toBe(
      true,
    );
    expect(
      bundledRecipeCatalog.recipes.every(
        (recipe) => getRecipeIconPresentation(recipe).kind !== "unknown",
      ),
    ).toBe(true);
  });

  it("distinguishes oven, pot and pan lunch recipes", () => {
    const findLunch = (method: string) => {
      const recipe = bundledRecipeCatalog.recipes.find((candidate) =>
        candidate.id.startsWith(`lunch-${method}-`),
      );
      if (!recipe) throw new Error(`Missing lunch recipe ${method}`);
      return getRecipeIconPresentation(recipe);
    };

    expect(findLunch("oven").kind).toBe("oven");
    expect(findLunch("pot").kind).toBe("pot");
    expect(findLunch("pan").kind).toBe("pan");
    expect(
      new Set([
        findLunch("oven").icon,
        findLunch("pot").icon,
        findLunch("pan").icon,
      ]).size,
    ).toBe(3);
  });

  it("adds ingredient badges for fish, meat and plant-based recipes", () => {
    const fish = bundledRecipeCatalog.recipes.find(({ ingredients }) =>
      ingredients.some(({ ingredientId }) => ingredientId === "salmon"),
    );
    const meat = bundledRecipeCatalog.recipes.find(({ ingredients }) =>
      ingredients.some(({ ingredientId }) => ingredientId === "chicken"),
    );
    const plant = bundledRecipeCatalog.recipes.find(
      ({ id }) => id === "lunch-oven-knuspertofu",
    );

    expect(fish && getRecipeIconPresentation(fish).badge).toBe("fish");
    expect(meat && getRecipeIconPresentation(meat).badge).toBe(
      "food-drumstick",
    );
    expect(plant && getRecipeIconPresentation(plant).badge).toBe("sprout");
  });
});
