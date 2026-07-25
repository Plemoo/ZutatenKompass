export type Locale = "de" | "en";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type Difficulty = "easy" | "medium" | "hard";

export interface IngredientConcept {
  readonly id: string;
  readonly name: LocalizedText;
  readonly aliases: Readonly<Record<Locale, readonly string[]>>;
  readonly parentId?: string;
  readonly isPantryStaple: boolean;
}

export interface RecipeIngredient {
  readonly ingredientId: string;
  readonly amount: number;
  readonly unit: LocalizedText;
  readonly note?: LocalizedText;
}

export interface Recipe {
  readonly id: string;
  readonly title: LocalizedText;
  readonly servings: number;
  readonly prepMinutes: number;
  readonly cookMinutes: number;
  readonly totalMinutes: number;
  readonly difficulty: Difficulty;
  readonly ingredients: readonly RecipeIngredient[];
  readonly steps: readonly LocalizedText[];
  readonly facetOptionIds: readonly string[];
}

export interface FacetOption {
  readonly id: string;
  readonly groupId: string;
  readonly label: LocalizedText;
  readonly parentId?: string;
}

export interface FacetGroup {
  readonly id: string;
  readonly label: LocalizedText;
  readonly options: readonly FacetOption[];
}

export interface RecipeCatalog {
  readonly version: number;
  readonly ingredients: readonly IngredientConcept[];
  readonly facets: readonly FacetGroup[];
  readonly recipes: readonly Recipe[];
}

export interface FacetSelection {
  readonly groupId: string;
  readonly optionIds: readonly string[];
}

export interface RecipeSearchQuery {
  readonly includeIngredientIds: readonly string[];
  readonly excludeIngredientIds: readonly string[];
  readonly facets: readonly FacetSelection[];
  readonly locale: Locale;
}

export interface IngredientHighlight {
  readonly requestedIngredientId: string;
  readonly matchedRecipeIngredientIds: readonly string[];
}

export interface RecipeMatchHighlights {
  readonly ingredients: readonly IngredientHighlight[];
  readonly facetOptionIds: readonly string[];
}

export interface RecipeMatch {
  readonly recipe: Recipe;
  readonly score: number;
  readonly additionalIngredientIds: readonly string[];
  readonly highlights: RecipeMatchHighlights;
}

export interface RecipeSearchResult {
  readonly matches: readonly RecipeMatch[];
  readonly total: number;
  readonly unknownIncludeIngredientIds: readonly string[];
  readonly unknownExcludeIngredientIds: readonly string[];
  readonly unknownFacetOptionIds: readonly string[];
}

export interface IngredientSuggestion {
  readonly ingredient: IngredientConcept;
  readonly matchedLabel: string;
  readonly distance: number;
  readonly score: number;
}

export type IngredientResolution =
  | {
      readonly status: "resolved";
      readonly ingredient: IngredientConcept;
      readonly matchedLabel: string;
    }
  | {
      readonly status: "ambiguous";
      readonly candidates: readonly IngredientConcept[];
    }
  | {
      readonly status: "unknown";
      readonly suggestions: readonly IngredientSuggestion[];
    };
