import type {
  IngredientConcept,
  IngredientResolution,
  IngredientSuggestion,
  Locale,
  RecipeCatalog,
} from "./models";

const COMBINING_MARKS = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;

export function normalizeIngredientInput(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("de-DE")
    .replaceAll("ß", "ss")
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(NON_ALPHANUMERIC, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function levenshteinDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        (current[rightIndex - 1] ?? 0) + 1,
        (previous[rightIndex] ?? 0) + 1,
        (previous[rightIndex - 1] ?? 0) + substitutionCost,
      );
    }
    previous = current;
  }
  return previous[right.length] ?? Math.max(left.length, right.length);
}

function labelsFor(
  ingredient: IngredientConcept,
  locale: Locale,
): readonly string[] {
  return [
    ingredient.name[locale],
    ...ingredient.aliases[locale],
    ingredient.name[locale === "de" ? "en" : "de"],
  ];
}

function allowedDistance(length: number): number {
  if (length < 3) return 0;
  if (length <= 5) return 1;
  if (length <= 11) return 2;
  return 3;
}

export function suggestIngredients(
  input: string,
  catalog: RecipeCatalog,
  options: { readonly locale?: Locale; readonly limit?: number } = {},
): readonly IngredientSuggestion[] {
  const locale = options.locale ?? "de";
  const limit = options.limit ?? 3;
  const normalizedInput = normalizeIngredientInput(input);
  if (normalizedInput.length < 3 || limit <= 0) return [];

  const candidates: IngredientSuggestion[] = [];
  for (const ingredient of catalog.ingredients) {
    let best: IngredientSuggestion | undefined;
    for (const label of labelsFor(ingredient, locale)) {
      const normalizedLabel = normalizeIngredientInput(label);
      const distance = levenshteinDistance(normalizedInput, normalizedLabel);
      const longest = Math.max(normalizedInput.length, normalizedLabel.length);
      const score = longest === 0 ? 1 : 1 - distance / longest;
      if (
        distance <= allowedDistance(longest) &&
        score >= 0.72 &&
        (!best ||
          distance < best.distance ||
          (distance === best.distance && score > best.score))
      ) {
        best = { ingredient, matchedLabel: label, distance, score };
      }
    }
    if (best) candidates.push(best);
  }

  return candidates
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        b.score - a.score ||
        a.ingredient.id.localeCompare(b.ingredient.id),
    )
    .slice(0, limit);
}

export function resolveIngredient(
  input: string,
  locale: Locale,
  catalog: RecipeCatalog,
): IngredientResolution {
  const normalizedInput = normalizeIngredientInput(input);
  if (!normalizedInput) return { status: "unknown", suggestions: [] };

  const matches = catalog.ingredients.filter((ingredient) =>
    labelsFor(ingredient, locale).some(
      (label) => normalizeIngredientInput(label) === normalizedInput,
    ),
  );
  if (matches.length === 1) {
    const ingredient = matches[0]!;
    const matchedLabel =
      labelsFor(ingredient, locale).find(
        (label) => normalizeIngredientInput(label) === normalizedInput,
      ) ?? ingredient.name[locale];
    return { status: "resolved", ingredient, matchedLabel };
  }
  if (matches.length > 1) {
    return {
      status: "ambiguous",
      candidates: matches.sort((a, b) => a.id.localeCompare(b.id)),
    };
  }
  return {
    status: "unknown",
    suggestions: suggestIngredients(input, catalog, { locale }),
  };
}
