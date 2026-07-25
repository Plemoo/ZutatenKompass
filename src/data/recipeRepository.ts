import {
  resolveIngredient,
  searchRecipes,
  suggestIngredients,
  type IngredientResolution,
  type IngredientSuggestion,
  type Locale,
  type Recipe,
  type RecipeCatalog,
  type RecipeSearchQuery,
  type RecipeSearchResult,
} from "../domain";

import { bundledRecipeCatalog } from "./catalog";

export interface RecipeRepository {
  getCatalog(): RecipeCatalog;
  getRecipeById(id: string): Recipe | undefined;
  search(query: RecipeSearchQuery): RecipeSearchResult;
  suggestIngredients(
    input: string,
    locale: Locale,
    limit?: number,
  ): readonly IngredientSuggestion[];
  resolveIngredient(input: string, locale: Locale): IngredientResolution;
}

class BundledRecipeRepository implements RecipeRepository {
  private readonly recipeById: ReadonlyMap<string, Recipe>;

  constructor(private readonly catalog: RecipeCatalog) {
    this.recipeById = new Map(
      catalog.recipes.map((recipe) => [recipe.id, recipe]),
    );
  }

  getCatalog(): RecipeCatalog {
    return this.catalog;
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipeById.get(id);
  }

  search(query: RecipeSearchQuery): RecipeSearchResult {
    return searchRecipes(query, this.catalog);
  }

  suggestIngredients(
    input: string,
    locale: Locale,
    limit = 3,
  ): readonly IngredientSuggestion[] {
    return suggestIngredients(input, this.catalog, { locale, limit });
  }

  resolveIngredient(input: string, locale: Locale): IngredientResolution {
    return resolveIngredient(input, locale, this.catalog);
  }
}

export function createBundledRecipeRepository(): RecipeRepository {
  return new BundledRecipeRepository(bundledRecipeCatalog);
}
