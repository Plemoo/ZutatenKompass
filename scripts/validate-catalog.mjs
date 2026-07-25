import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const path = resolve(process.cwd(), "src/data/generated/catalog.json");
const catalog = JSON.parse(await readFile(path, "utf8"));
const errors = [];
const requireLocalized = (value, location) => {
  if (!value || typeof value.de !== "string" || value.de.trim().length === 0) {
    errors.push(`${location}.de is missing`);
  }
  if (!value || typeof value.en !== "string" || value.en.trim().length === 0) {
    errors.push(`${location}.en is missing`);
  }
};
const findDuplicates = (values) => [
  ...new Set(values.filter((value, index) => values.indexOf(value) !== index)),
];

if (!Number.isInteger(catalog.version) || catalog.version < 1) {
  errors.push("catalog.version must be a positive integer");
}
if (!Array.isArray(catalog.recipes) || catalog.recipes.length < 500) {
  errors.push("catalog must contain at least 500 recipes");
}

const ingredientIds = catalog.ingredients.map((item) => item.id);
const ingredientIdSet = new Set(ingredientIds);
for (const id of findDuplicates(ingredientIds))
  errors.push(`duplicate ingredient id: ${id}`);
for (const item of catalog.ingredients) {
  requireLocalized(item.name, `ingredient ${item.id}.name`);
  if (!Array.isArray(item.aliases?.de) || !Array.isArray(item.aliases?.en)) {
    errors.push(`ingredient ${item.id} must have de/en alias arrays`);
  }
  if (item.parentId && !ingredientIdSet.has(item.parentId)) {
    errors.push(
      `ingredient ${item.id} references missing parent ${item.parentId}`,
    );
  }
  const visited = new Set([item.id]);
  let current = item;
  while (current.parentId) {
    if (visited.has(current.parentId)) {
      errors.push(`ingredient hierarchy cycle at ${item.id}`);
      break;
    }
    visited.add(current.parentId);
    current = catalog.ingredients.find(
      (candidate) => candidate.id === current.parentId,
    );
    if (!current) break;
  }
}

const facetGroupIds = catalog.facets.map((group) => group.id);
for (const id of findDuplicates(facetGroupIds))
  errors.push(`duplicate facet group id: ${id}`);
const facetOptionIds = catalog.facets.flatMap((group) =>
  group.options.map((option) => option.id),
);
const facetOptionIdSet = new Set(facetOptionIds);
for (const id of findDuplicates(facetOptionIds))
  errors.push(`duplicate facet option id: ${id}`);
for (const group of catalog.facets) {
  requireLocalized(group.label, `facet group ${group.id}.label`);
  if (!Array.isArray(group.options) || group.options.length === 0) {
    errors.push(`facet group ${group.id} has no options`);
  }
  for (const option of group.options) {
    requireLocalized(option.label, `facet option ${option.id}.label`);
    if (option.groupId !== group.id) {
      errors.push(`facet option ${option.id} has wrong groupId`);
    }
    if (
      option.parentId &&
      !group.options.some((candidate) => candidate.id === option.parentId)
    ) {
      errors.push(
        `facet option ${option.id} references missing or cross-group parent ${option.parentId}`,
      );
    }
    const visited = new Set([option.id]);
    let current = option;
    while (current.parentId) {
      if (visited.has(current.parentId)) {
        errors.push(`facet hierarchy cycle at ${option.id}`);
        break;
      }
      visited.add(current.parentId);
      current = group.options.find(
        (candidate) => candidate.id === current.parentId,
      );
      if (!current) break;
    }
  }
}

const recipeIds = catalog.recipes.map((recipe) => recipe.id);
for (const id of findDuplicates(recipeIds))
  errors.push(`duplicate recipe id: ${id}`);
const titlesDe = catalog.recipes.map((recipe) =>
  recipe.title?.de?.toLocaleLowerCase("de"),
);
const titlesEn = catalog.recipes.map((recipe) =>
  recipe.title?.en?.toLocaleLowerCase("en"),
);
for (const title of findDuplicates(titlesDe))
  errors.push(`duplicate German recipe title: ${title}`);
for (const title of findDuplicates(titlesEn))
  errors.push(`duplicate English recipe title: ${title}`);

for (const recipe of catalog.recipes) {
  requireLocalized(recipe.title, `recipe ${recipe.id}.title`);
  if (
    !Number.isInteger(recipe.servings) ||
    recipe.servings < 1 ||
    recipe.servings > 12
  ) {
    errors.push(`recipe ${recipe.id} has invalid servings`);
  }
  if (
    !Number.isInteger(recipe.prepMinutes) ||
    !Number.isInteger(recipe.cookMinutes) ||
    recipe.totalMinutes !== recipe.prepMinutes + recipe.cookMinutes ||
    recipe.prepMinutes < 1 ||
    recipe.prepMinutes > 180 ||
    recipe.cookMinutes < 1 ||
    recipe.cookMinutes > 300 ||
    recipe.totalMinutes > 360
  ) {
    errors.push(`recipe ${recipe.id} has inconsistent times`);
  }
  if (!["easy", "medium", "hard"].includes(recipe.difficulty)) {
    errors.push(`recipe ${recipe.id} has invalid difficulty`);
  }
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length < 6) {
    errors.push(
      `recipe ${recipe.id} is too trivial (fewer than 6 ingredients)`,
    );
  }
  if (!Array.isArray(recipe.steps) || recipe.steps.length < 3) {
    errors.push(`recipe ${recipe.id} is too trivial (fewer than 3 steps)`);
  }
  if (recipe.totalMinutes < 20) {
    errors.push(`recipe ${recipe.id} is too trivial (under 20 minutes)`);
  }
  for (const [index, line] of recipe.ingredients.entries()) {
    if (!ingredientIdSet.has(line.ingredientId)) {
      errors.push(
        `recipe ${recipe.id} ingredient ${index} references ${line.ingredientId}`,
      );
    }
    if (
      typeof line.amount !== "number" ||
      !Number.isFinite(line.amount) ||
      line.amount <= 0 ||
      line.amount > 5000
    ) {
      errors.push(`recipe ${recipe.id} ingredient ${index} has invalid amount`);
    }
    requireLocalized(
      line.unit,
      `recipe ${recipe.id}.ingredients[${index}].unit`,
    );
    if (line.note)
      requireLocalized(
        line.note,
        `recipe ${recipe.id}.ingredients[${index}].note`,
      );
  }
  for (const [index, step] of recipe.steps.entries()) {
    requireLocalized(step, `recipe ${recipe.id}.steps[${index}]`);
    if (
      (step?.de?.trim().length ?? 0) < 30 ||
      (step?.en?.trim().length ?? 0) < 30
    ) {
      errors.push(`recipe ${recipe.id} step ${index} is not substantive`);
    }
  }

  const criticalProteinIds = new Set([
    "chicken",
    "turkey",
    "pork",
    "salmon",
    "cod",
    "tuna",
    "shrimp",
  ]);
  const containsCriticalProtein = recipe.ingredients.some(({ ingredientId }) =>
    criticalProteinIds.has(ingredientId),
  );
  if (containsCriticalProtein) {
    const instructionsDe = recipe.steps.map(({ de }) => de).join(" ");
    const instructionsEn = recipe.steps.map(({ en }) => en).join(" ");
    if (
      !/vollständig (?:durch)?garen|durchgehend heiß|nicht mehr rosa|opak/i.test(
        instructionsDe,
      ) ||
      !/cook(?:ed)?(?: [a-z]+){0,3} through|hot and opaque|no longer (?:be )?pink/i.test(
        instructionsEn,
      )
    ) {
      errors.push(`recipe ${recipe.id} lacks explicit safe cooking guidance`);
    }
  }
  if (
    !Array.isArray(recipe.facetOptionIds) ||
    recipe.facetOptionIds.length < 5
  ) {
    errors.push(`recipe ${recipe.id} has insufficient facets`);
  }
  for (const id of recipe.facetOptionIds) {
    if (!facetOptionIdSet.has(id))
      errors.push(`recipe ${recipe.id} references facet ${id}`);
  }
}

if (errors.length > 0) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100)
    console.error(`...and ${errors.length - 100} more errors`);
  process.exitCode = 1;
} else {
  console.log(
    `Catalog valid: ${catalog.recipes.length} recipes, ${catalog.ingredients.length} ingredients, ${facetOptionIds.length} facet options.`,
  );
}
