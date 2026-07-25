/// <reference types="jest" />

import {
  levenshteinDistance,
  normalizeIngredientInput,
  resolveIngredient,
  suggestIngredients,
  type RecipeCatalog,
} from "../../src/domain";

const catalog: RecipeCatalog = {
  version: 1,
  ingredients: [
    {
      id: "cheese",
      name: { de: "Käse", en: "cheese" },
      aliases: { de: ["Kaese"], en: [] },
      isPantryStaple: false,
    },
    {
      id: "chickpea",
      name: { de: "Kichererbse", en: "chickpea" },
      aliases: {
        de: ["Kichererbsen"],
        en: ["chickpeas", "garbanzo bean"],
      },
      isPantryStaple: false,
    },
    {
      id: "bell-pepper",
      name: { de: "Paprika", en: "bell pepper" },
      aliases: { de: ["Peperoni"], en: ["capsicum"] },
      isPantryStaple: false,
    },
  ],
  facets: [],
  recipes: [],
};

describe("normalizeIngredientInput", () => {
  it.each([
    ["  KÄSE ", "kase"],
    ["Straße", "strasse"],
    ["Crème-fraîche", "creme fraiche"],
    ["  rote   Paprika! ", "rote paprika"],
  ])("normalizes %p to %p", (input, expected) => {
    expect(normalizeIngredientInput(input)).toBe(expected);
  });
});

describe("levenshteinDistance", () => {
  it.each([
    ["", "", 0],
    ["reis", "reis", 0],
    ["reis", "mais", 2],
    ["kichererbse", "kichererbse", 0],
    ["kichererbse", "kichererbse", 0],
    ["paprika", "paprka", 1],
  ])("calculates the distance between %p and %p", (left, right, expected) => {
    expect(levenshteinDistance(left, right)).toBe(expected);
  });
});

describe("ingredient resolution and suggestions", () => {
  it("resolves localized names after diacritic folding", () => {
    const result = resolveIngredient("Kase", "de", catalog);
    expect(result.status).toBe("resolved");
    if (result.status === "resolved")
      expect(result.ingredient.id).toBe("cheese");
  });

  it("resolves locale aliases exactly", () => {
    const result = resolveIngredient("garbanzo bean", "en", catalog);
    expect(result.status).toBe("resolved");
    if (result.status === "resolved")
      expect(result.ingredient.id).toBe("chickpea");
  });

  it("offers conservative typo suggestions", () => {
    const suggestions = suggestIngredients("Kichererbsee", catalog, {
      locale: "de",
    });
    expect(suggestions[0]?.ingredient.id).toBe("chickpea");
    expect(suggestions[0]?.distance).toBe(1);
  });

  it("finds a localized alias typo", () => {
    expect(
      suggestIngredients("capsicun", catalog, { locale: "en" })[0]?.ingredient
        .id,
    ).toBe("bell-pepper");
  });

  it("does not guess for very short or distant input", () => {
    expect(suggestIngredients("xy", catalog, { locale: "de" })).toEqual([]);
    expect(suggestIngredients("Schokolade", catalog, { locale: "de" })).toEqual(
      [],
    );
  });

  it("returns unknown with suggestions instead of silently resolving a typo", () => {
    const result = resolveIngredient("Paprka", "de", catalog);
    expect(result.status).toBe("unknown");
    if (result.status === "unknown") {
      expect(result.suggestions[0]?.ingredient.id).toBe("bell-pepper");
    }
  });
});
