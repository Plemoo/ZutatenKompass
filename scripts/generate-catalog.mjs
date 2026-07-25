import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "src/data/generated/catalog.json");
const text = (de, en) => ({ de, en });
const ingredient = (
  id,
  de,
  en,
  { parentId, deAliases = [], enAliases = [], staple = false } = {},
) => ({
  id,
  name: text(de, en),
  aliases: { de: deAliases, en: enAliases },
  ...(parentId ? { parentId } : {}),
  isPantryStaple: staple,
});

const ingredients = [
  ingredient("grain", "Getreide", "grain", { deAliases: ["Getreideprodukt"] }),
  ingredient("rice", "Reis", "rice", { parentId: "grain" }),
  ingredient("basmati-rice", "Basmatireis", "basmati rice", {
    parentId: "rice",
    deAliases: ["Basmati"],
  }),
  ingredient("brown-rice", "Vollkornreis", "brown rice", {
    parentId: "rice",
    deAliases: ["Naturreis"],
  }),
  ingredient("pasta", "Pasta", "pasta", {
    parentId: "grain",
    deAliases: ["Nudeln"],
    enAliases: ["noodles"],
  }),
  ingredient("spaghetti", "Spaghetti", "spaghetti", { parentId: "pasta" }),
  ingredient("penne", "Penne", "penne", { parentId: "pasta" }),
  ingredient("couscous", "Couscous", "couscous", { parentId: "grain" }),
  ingredient("bulgur", "Bulgur", "bulgur", { parentId: "grain" }),
  ingredient("quinoa", "Quinoa", "quinoa", { parentId: "grain" }),
  ingredient("bread", "Brot", "bread", { parentId: "grain" }),
  ingredient("tortilla", "Tortilla", "tortilla", {
    parentId: "grain",
    deAliases: ["Wrap"],
  }),
  ingredient("flour", "Mehl", "flour", { parentId: "grain", staple: true }),
  ingredient("legume", "Hülsenfrucht", "legume", {
    deAliases: ["Hülsenfrüchte"],
    enAliases: ["pulses"],
  }),
  ingredient("chickpea", "Kichererbse", "chickpea", {
    parentId: "legume",
    deAliases: ["Kichererbsen"],
    enAliases: ["chickpeas"],
  }),
  ingredient("lentil", "Linse", "lentil", {
    parentId: "legume",
    deAliases: ["Linsen"],
    enAliases: ["lentils"],
  }),
  ingredient("bean", "Bohne", "bean", {
    parentId: "legume",
    deAliases: ["Bohnen"],
    enAliases: ["beans"],
  }),
  ingredient("kidney-bean", "Kidneybohne", "kidney bean", {
    parentId: "bean",
    deAliases: ["Kidneybohnen"],
    enAliases: ["kidney beans"],
  }),
  ingredient("white-bean", "Weiße Bohne", "white bean", {
    parentId: "bean",
    deAliases: ["weiße Bohnen"],
    enAliases: ["white beans"],
  }),
  ingredient("tofu", "Tofu", "tofu", { parentId: "legume" }),
  ingredient("meat", "Fleisch", "meat"),
  ingredient("chicken", "Hähnchen", "chicken", {
    parentId: "meat",
    deAliases: ["Huhn", "Hähnchenfleisch"],
  }),
  ingredient("turkey", "Pute", "turkey", {
    parentId: "meat",
    deAliases: ["Putenfleisch"],
  }),
  ingredient("beef", "Rindfleisch", "beef", {
    parentId: "meat",
    deAliases: ["Rind"],
  }),
  ingredient("pork", "Schweinefleisch", "pork", {
    parentId: "meat",
    deAliases: ["Schwein"],
  }),
  ingredient("seafood", "Fisch und Meeresfrüchte", "fish and seafood", {
    deAliases: ["Fisch"],
  }),
  ingredient("salmon", "Lachs", "salmon", { parentId: "seafood" }),
  ingredient("cod", "Kabeljau", "cod", { parentId: "seafood" }),
  ingredient("tuna", "Thunfisch", "tuna", { parentId: "seafood" }),
  ingredient("shrimp", "Garnele", "shrimp", {
    parentId: "seafood",
    deAliases: ["Garnelen"],
    enAliases: ["prawn", "prawns"],
  }),
  ingredient("dairy", "Milchprodukt", "dairy", {
    deAliases: ["Milchprodukte"],
  }),
  ingredient("cheese", "Käse", "cheese", {
    parentId: "dairy",
    deAliases: ["Kaese"],
  }),
  ingredient("cheddar", "Cheddar", "cheddar", { parentId: "cheese" }),
  ingredient("gouda", "Gouda", "gouda", { parentId: "cheese" }),
  ingredient("feta", "Feta", "feta", {
    parentId: "cheese",
    deAliases: ["Schafskäse"],
  }),
  ingredient("mozzarella", "Mozzarella", "mozzarella", { parentId: "cheese" }),
  ingredient("parmesan", "Parmesan", "parmesan", { parentId: "cheese" }),
  ingredient("yogurt", "Joghurt", "yogurt", {
    parentId: "dairy",
    deAliases: ["Naturjoghurt"],
    enAliases: ["yoghurt"],
  }),
  ingredient("cream", "Sahne", "cream", { parentId: "dairy" }),
  ingredient("milk", "Milch", "milk", { parentId: "dairy" }),
  ingredient("butter", "Butter", "butter", { parentId: "dairy", staple: true }),
  ingredient("egg", "Ei", "egg", { deAliases: ["Eier"], enAliases: ["eggs"] }),
  ingredient("vegetable", "Gemüse", "vegetable", { enAliases: ["vegetables"] }),
  ingredient("potato", "Kartoffel", "potato", {
    parentId: "vegetable",
    deAliases: ["Kartoffeln"],
    enAliases: ["potatoes"],
  }),
  ingredient("sweet-potato", "Süßkartoffel", "sweet potato", {
    parentId: "vegetable",
    deAliases: ["Süsskartoffel", "Süßkartoffeln"],
    enAliases: ["sweet potatoes"],
  }),
  ingredient("tomato", "Tomate", "tomato", {
    parentId: "vegetable",
    deAliases: ["Tomaten"],
    enAliases: ["tomatoes"],
  }),
  ingredient("canned-tomato", "Dosentomate", "canned tomato", {
    parentId: "tomato",
    deAliases: ["gehackte Tomaten"],
    enAliases: ["canned tomatoes"],
  }),
  ingredient("bell-pepper", "Paprika", "bell pepper", {
    parentId: "vegetable",
    deAliases: ["Peperoni"],
    enAliases: ["pepper", "capsicum"],
  }),
  ingredient("zucchini", "Zucchini", "zucchini", {
    parentId: "vegetable",
    enAliases: ["courgette"],
  }),
  ingredient("eggplant", "Aubergine", "eggplant", {
    parentId: "vegetable",
    enAliases: ["aubergine"],
  }),
  ingredient("broccoli", "Brokkoli", "broccoli", { parentId: "vegetable" }),
  ingredient("cauliflower", "Blumenkohl", "cauliflower", {
    parentId: "vegetable",
  }),
  ingredient("spinach", "Spinat", "spinach", { parentId: "vegetable" }),
  ingredient("kale", "Grünkohl", "kale", { parentId: "vegetable" }),
  ingredient("carrot", "Karotte", "carrot", {
    parentId: "vegetable",
    deAliases: ["Möhre", "Karotten"],
    enAliases: ["carrots"],
  }),
  ingredient("onion", "Zwiebel", "onion", {
    parentId: "vegetable",
    deAliases: ["Zwiebeln"],
    enAliases: ["onions"],
    staple: true,
  }),
  ingredient("garlic", "Knoblauch", "garlic", {
    parentId: "vegetable",
    staple: true,
  }),
  ingredient("mushroom", "Champignon", "mushroom", {
    parentId: "vegetable",
    deAliases: ["Pilz", "Pilze", "Champignons"],
    enAliases: ["mushrooms"],
  }),
  ingredient("cucumber", "Gurke", "cucumber", { parentId: "vegetable" }),
  ingredient("pumpkin", "Kürbis", "pumpkin", {
    parentId: "vegetable",
    enAliases: ["squash"],
  }),
  ingredient("pea", "Erbse", "pea", {
    parentId: "vegetable",
    deAliases: ["Erbsen"],
    enAliases: ["peas"],
  }),
  ingredient("corn", "Mais", "corn", {
    parentId: "vegetable",
    enAliases: ["sweetcorn"],
  }),
  ingredient("leek", "Lauch", "leek", {
    parentId: "vegetable",
    deAliases: ["Porree"],
  }),
  ingredient("celery", "Sellerie", "celery", { parentId: "vegetable" }),
  ingredient("cabbage", "Kohl", "cabbage", { parentId: "vegetable" }),
  ingredient("asparagus", "Spargel", "asparagus", { parentId: "vegetable" }),
  ingredient("green-bean", "Grüne Bohne", "green bean", {
    parentId: "bean",
    deAliases: ["grüne Bohnen"],
    enAliases: ["green beans"],
  }),
  ingredient("fruit", "Obst", "fruit"),
  ingredient("apple", "Apfel", "apple", {
    parentId: "fruit",
    deAliases: ["Äpfel"],
    enAliases: ["apples"],
  }),
  ingredient("pear", "Birne", "pear", { parentId: "fruit" }),
  ingredient("lemon", "Zitrone", "lemon", { parentId: "fruit" }),
  ingredient("lime", "Limette", "lime", { parentId: "fruit" }),
  ingredient("avocado", "Avocado", "avocado", { parentId: "fruit" }),
  ingredient("mango", "Mango", "mango", { parentId: "fruit" }),
  ingredient("nut", "Nuss", "nut", {
    deAliases: ["Nüsse"],
    enAliases: ["nuts"],
  }),
  ingredient("almond", "Mandel", "almond", {
    parentId: "nut",
    deAliases: ["Mandeln"],
    enAliases: ["almonds"],
  }),
  ingredient("walnut", "Walnuss", "walnut", {
    parentId: "nut",
    deAliases: ["Walnüsse"],
    enAliases: ["walnuts"],
  }),
  ingredient("peanut", "Erdnuss", "peanut", {
    parentId: "nut",
    deAliases: ["Erdnüsse"],
    enAliases: ["peanuts"],
  }),
  ingredient("seed", "Saat", "seed", {
    deAliases: ["Samen"],
    enAliases: ["seeds"],
  }),
  ingredient("sunflower-seed", "Sonnenblumenkern", "sunflower seed", {
    parentId: "seed",
    deAliases: ["Sonnenblumenkerne"],
    enAliases: ["sunflower seeds"],
  }),
  ingredient("sesame", "Sesam", "sesame", {
    parentId: "seed",
    enAliases: ["sesame seeds"],
  }),
  ingredient("olive-oil", "Olivenöl", "olive oil", { staple: true }),
  ingredient("neutral-oil", "Pflanzenöl", "vegetable oil", {
    deAliases: ["neutrales Öl"],
    staple: true,
  }),
  ingredient("salt", "Salz", "salt", { staple: true }),
  ingredient("black-pepper", "Schwarzer Pfeffer", "black pepper", {
    deAliases: ["Pfeffer"],
    enAliases: ["pepper"],
    staple: true,
  }),
  ingredient("paprika-spice", "Paprikapulver", "paprika", {
    deAliases: ["Paprikagewürz"],
    staple: true,
  }),
  ingredient("cumin", "Kreuzkümmel", "cumin", {
    deAliases: ["Kumin"],
    staple: true,
  }),
  ingredient("curry-powder", "Currypulver", "curry powder", { staple: true }),
  ingredient("oregano", "Oregano", "oregano", { staple: true }),
  ingredient("basil", "Basilikum", "basil"),
  ingredient("parsley", "Petersilie", "parsley"),
  ingredient("cilantro", "Koriander", "cilantro", { enAliases: ["coriander"] }),
  ingredient("thyme", "Thymian", "thyme", { staple: true }),
  ingredient("rosemary", "Rosmarin", "rosemary", { staple: true }),
  ingredient("soy-sauce", "Sojasauce", "soy sauce"),
  ingredient("coconut-milk", "Kokosmilch", "coconut milk"),
  ingredient("vegetable-broth", "Gemüsebrühe", "vegetable broth", {
    staple: true,
  }),
  ingredient("mustard", "Senf", "mustard", { staple: true }),
  ingredient("vinegar", "Essig", "vinegar", { staple: true }),
  ingredient("tomato-paste", "Tomatenmark", "tomato paste", {
    parentId: "tomato",
    staple: true,
  }),
  ingredient("tahini", "Tahin", "tahini", {
    parentId: "sesame",
    deAliases: ["Sesampaste"],
  }),
  ingredient("peanut-butter", "Erdnussmus", "peanut butter", {
    parentId: "peanut",
    deAliases: ["Erdnussbutter"],
  }),
  ingredient("honey", "Honig", "honey"),
  ingredient("maple-syrup", "Ahornsirup", "maple syrup"),
];

const facetGroups = [
  {
    id: "meal",
    label: text("Mahlzeit", "Meal"),
    options: [
      ["meal-main", "Hauptgericht", "Main course"],
      ["meal-lunch", "Mittagessen", "Lunch", "meal-main"],
      ["meal-dinner", "Abendessen", "Dinner", "meal-main"],
    ],
  },
  {
    id: "diet",
    label: text("Ernährung", "Diet"),
    options: [
      ["diet-vegan", "Vegan", "Vegan"],
      ["diet-vegetarian", "Vegetarisch", "Vegetarian"],
      ["diet-omnivore", "Mit Fleisch oder Fisch", "Meat or fish"],
    ],
  },
  {
    id: "cuisine",
    label: text("Küche", "Cuisine"),
    options: [
      [
        "cuisine-mediterranean",
        "Mediterran",
        "Mediterranean",
        "cuisine-european",
      ],
      ["cuisine-asian", "Asiatisch", "Asian"],
      ["cuisine-middle-eastern", "Nahöstlich", "Middle Eastern"],
      ["cuisine-european", "Europäisch", "European"],
      ["cuisine-modern", "Modern", "Modern"],
    ],
  },
  {
    id: "time",
    label: text("Gesamtzeit", "Total time"),
    options: [
      ["time-under-30", "Unter 30 Minuten", "Under 30 minutes"],
      ["time-30-45", "30 bis 45 Minuten", "30 to 45 minutes"],
      ["time-over-45", "Über 45 Minuten", "Over 45 minutes"],
    ],
  },
  {
    id: "difficulty",
    label: text("Schwierigkeit", "Difficulty"),
    options: [
      ["difficulty-easy", "Einfach", "Easy"],
      ["difficulty-medium", "Mittel", "Medium"],
      ["difficulty-hard", "Anspruchsvoll", "Hard"],
    ],
  },
  {
    id: "method",
    label: text("Zubereitungsart", "Method"),
    options: [
      ["method-bowl", "Bowl", "Bowl"],
      ["method-pan", "Pfanne", "Pan"],
      ["method-pot", "Topf", "Pot"],
      ["method-oven", "Ofen", "Oven"],
      ["method-salad", "Salat", "Salad"],
    ],
  },
].map((group) => ({
  id: group.id,
  label: group.label,
  options: group.options.map(([id, de, en, parentId]) => ({
    id,
    groupId: group.id,
    label: text(de, en),
    ...(parentId ? { parentId } : {}),
  })),
}));

const ingredientById = new Map(ingredients.map((item) => [item.id, item]));
const name = (id, locale) => ingredientById.get(id).name[locale];
const unit = (de, en) => text(de, en);
const amount = (ingredientId, value, deUnit, enUnit, note) => ({
  ingredientId,
  amount: value,
  unit: unit(deUnit, enUnit),
  ...(note ? { note } : {}),
});
const uniqueIngredients = (items) => [
  ...new Map(items.map((item) => [item.ingredientId, item])).values(),
];

const animalIds = new Set([
  "chicken",
  "turkey",
  "beef",
  "pork",
  "salmon",
  "cod",
  "tuna",
  "shrimp",
]);
const vegetarianIds = new Set([
  "cheddar",
  "gouda",
  "feta",
  "mozzarella",
  "parmesan",
  "yogurt",
  "cream",
  "milk",
  "butter",
  "egg",
]);

function dietFacet(ids) {
  if (ids.some((id) => animalIds.has(id))) return "diet-omnivore";
  if (ids.some((id) => vegetarianIds.has(id))) return "diet-vegetarian";
  return "diet-vegan";
}

function timeFacet(total) {
  if (total < 30) return "time-under-30";
  if (total <= 45) return "time-30-45";
  return "time-over-45";
}

function difficultyFor(index) {
  return index % 17 === 0 ? "hard" : index % 5 === 0 ? "medium" : "easy";
}

const criticalProteins = new Set([
  "chicken",
  "turkey",
  "pork",
  "salmon",
  "cod",
  "tuna",
  "shrimp",
]);

function cookingGuidance(ingredientId, locale) {
  if (!criticalProteins.has(ingredientId)) return "";
  return locale === "de"
    ? " Dabei vollständig durchgaren; Geflügel und Schweinefleisch dürfen innen nicht mehr rosa sein, Fisch und Meeresfrüchte müssen durchgehend heiß und opak sein."
    : " Cook it through completely; poultry and pork must no longer be pink inside, and fish or seafood must be hot and opaque throughout.";
}

function createRecipe({
  id,
  titleDe,
  titleEn,
  ingredientLines,
  prep,
  cook,
  difficulty,
  cuisine,
  method,
  steps,
}) {
  const allIngredients = uniqueIngredients(ingredientLines);
  const total = prep + cook;
  return {
    id,
    title: text(titleDe, titleEn),
    servings: 4,
    prepMinutes: prep,
    cookMinutes: cook,
    totalMinutes: total,
    difficulty,
    ingredients: allIngredients,
    steps,
    facetOptionIds: [
      total <= 35 ? "meal-lunch" : "meal-dinner",
      dietFacet(allIngredients.map((line) => line.ingredientId)),
      cuisine,
      timeFacet(total),
      `difficulty-${difficulty}`,
      method,
    ],
  };
}

const recipes = [];
function addFamily(prefix, limit, combinations, build) {
  let count = 0;
  for (const combination of combinations) {
    if (count >= limit) break;
    count += 1;
    recipes.push(
      build(combination, count, `${prefix}-${String(count).padStart(3, "0")}`),
    );
  }
}

function combinationsOf(...groups) {
  return groups.reduce(
    (results, group) =>
      results.flatMap((result) => group.map((item) => [...result, item])),
    [[]],
  );
}

const grains = ["basmati-rice", "brown-rice", "quinoa", "couscous", "bulgur"];
const proteins = [
  "chickpea",
  "lentil",
  "kidney-bean",
  "white-bean",
  "tofu",
  "chicken",
  "salmon",
  "feta",
];
const vegetables = [
  "bell-pepper",
  "zucchini",
  "eggplant",
  "broccoli",
  "cauliflower",
  "spinach",
  "carrot",
  "mushroom",
  "pumpkin",
  "green-bean",
];
const dressings = ["tahini", "yogurt", "soy-sauce", "peanut-butter"];

addFamily(
  "bowl",
  90,
  combinationsOf(grains, proteins, vegetables),
  ([base, protein, vegetable], index, id) => {
    const dressing = dressings[index % dressings.length];
    return createRecipe({
      id,
      titleDe: `${name(vegetable, "de")}-${name(protein, "de")}-Bowl mit ${name(base, "de")}`,
      titleEn: `${name(vegetable, "en")} and ${name(protein, "en")} bowl with ${name(base, "en")}`,
      ingredientLines: [
        amount(base, 260, "g", "g"),
        amount(protein, 280, "g", "g"),
        amount(vegetable, 320, "g", "g"),
        amount(dressing, 3, "EL", "tbsp"),
        amount("lemon", 1, "Stück", "piece"),
        amount("olive-oil", 2, "EL", "tbsp"),
        amount("salt", 1, "Prise", "pinch"),
        amount("black-pepper", 1, "Prise", "pinch"),
      ],
      prep: 14 + (index % 4),
      cook: 18 + (index % 7),
      difficulty: difficultyFor(index),
      cuisine: index % 2 ? "cuisine-mediterranean" : "cuisine-modern",
      method: "method-bowl",
      steps: [
        text(
          `${name(base, "de")} nach Packungsangabe garen und kurz ausdampfen lassen.`,
          `Cook the ${name(base, "en")} according to the packet and let it steam dry briefly.`,
        ),
        text(
          `${name(vegetable, "de")} mundgerecht schneiden und mit Olivenöl in einer großen Pfanne kräftig anrösten.`,
          `Cut the ${name(vegetable, "en")} into bite-sized pieces and sear in olive oil in a large pan.`,
        ),
        text(
          `${name(protein, "de")} zugeben, würzen und alles garen, bis die Zutaten aromatisch verbunden sind.${cookingGuidance(protein, "de")}`,
          `Add the ${name(protein, "en")}, season, and cook until the ingredients are aromatic and combined.${cookingGuidance(protein, "en")}`,
        ),
        text(
          `${name(dressing, "de")} mit Zitronensaft verrühren, die Bowl anrichten und das Dressing darübergeben.`,
          `Stir the ${name(dressing, "en")} with lemon juice, assemble the bowl, and spoon over the dressing.`,
        ),
      ],
    });
  },
);

const pastaTypes = ["spaghetti", "penne"];
const pastaProteins = [
  "chickpea",
  "white-bean",
  "chicken",
  "tuna",
  "mozzarella",
  "lentil",
];
addFamily(
  "pasta",
  86,
  combinationsOf(pastaTypes, pastaProteins, vegetables),
  ([pasta, protein, vegetable], index, id) =>
    createRecipe({
      id,
      titleDe: `${name(pasta, "de")} mit ${name(vegetable, "de")} und ${name(protein, "de")}`,
      titleEn: `${name(pasta, "en")} with ${name(vegetable, "en")} and ${name(protein, "en")}`,
      ingredientLines: [
        amount(pasta, 360, "g", "g"),
        amount(protein, 260, "g", "g"),
        amount(vegetable, 300, "g", "g"),
        amount("canned-tomato", 400, "g", "g"),
        amount("garlic", 2, "Zehen", "cloves"),
        amount("olive-oil", 2, "EL", "tbsp"),
        amount(index % 2 ? "basil" : "oregano", 2, "EL", "tbsp"),
        amount("black-pepper", 1, "Prise", "pinch"),
      ],
      prep: 12 + (index % 5),
      cook: 20 + (index % 8),
      difficulty: difficultyFor(index + 2),
      cuisine: "cuisine-mediterranean",
      method: "method-pan",
      steps: [
        text(
          `${name(pasta, "de")} in Salzwasser bissfest kochen und etwas Kochwasser auffangen.`,
          `Cook the ${name(pasta, "en")} in salted water until al dente, reserving a little cooking water.`,
        ),
        text(
          `${name(vegetable, "de")} schneiden und mit Knoblauch in Olivenöl anbraten.`,
          `Cut the ${name(vegetable, "en")} and sauté it with garlic in olive oil.`,
        ),
        text(
          `${name(protein, "de")} und Dosentomaten einrühren, würzen und die Sauce sanft einkochen.${cookingGuidance(protein, "de")}`,
          `Stir in the ${name(protein, "en")} and canned tomatoes, season, and gently reduce the sauce.${cookingGuidance(protein, "en")}`,
        ),
        text(
          `Die Pasta mit der Sauce vermengen, bei Bedarf Kochwasser zugeben und mit Kräutern servieren.`,
          `Toss the pasta with the sauce, loosen with cooking water if needed, and serve with herbs.`,
        ),
      ],
    }),
);

const curryProteins = [
  "chickpea",
  "lentil",
  "kidney-bean",
  "tofu",
  "chicken",
  "shrimp",
];
addFamily(
  "curry",
  86,
  combinationsOf(curryProteins, vegetables, ["basmati-rice", "brown-rice"]),
  ([protein, vegetable, rice], index, id) =>
    createRecipe({
      id,
      titleDe: `${name(protein, "de")}-${name(vegetable, "de")}-Curry mit ${name(rice, "de")}`,
      titleEn: `${name(protein, "en")} and ${name(vegetable, "en")} curry with ${name(rice, "en")}`,
      ingredientLines: [
        amount(protein, 300, "g", "g"),
        amount(vegetable, 340, "g", "g"),
        amount(rice, 260, "g", "g"),
        amount("coconut-milk", 400, "ml", "ml"),
        amount("onion", 1, "Stück", "piece"),
        amount("curry-powder", 2, "TL", "tsp"),
        amount("neutral-oil", 2, "EL", "tbsp"),
        amount("lime", 1, "Stück", "piece"),
      ],
      prep: 14 + (index % 4),
      cook: 24 + (index % 10),
      difficulty: difficultyFor(index + 4),
      cuisine: "cuisine-asian",
      method: "method-pot",
      steps: [
        text(
          `${name(rice, "de")} waschen und in einem separaten Topf garen.`,
          `Rinse the ${name(rice, "en")} and cook it in a separate pot.`,
        ),
        text(
          `Zwiebel und ${name(vegetable, "de")} schneiden, dann in Öl mehrere Minuten anrösten.`,
          `Cut the onion and ${name(vegetable, "en")}, then sauté them in oil for several minutes.`,
        ),
        text(
          `Currypulver und ${name(protein, "de")} zufügen, mit Kokosmilch ablöschen und vollständig garen.`,
          `Add curry powder and ${name(protein, "en")}, pour in coconut milk, and cook through.`,
        ),
        text(
          `Das Curry mit Limettensaft abschmecken und zusammen mit dem Reis anrichten.`,
          `Season the curry with lime juice and serve it with the rice.`,
        ),
      ],
    }),
);

const soupBases = [
  "potato",
  "sweet-potato",
  "lentil",
  "white-bean",
  "chickpea",
  "pumpkin",
];
const soupVegetables = [
  "carrot",
  "leek",
  "celery",
  "spinach",
  "kale",
  "cauliflower",
  "broccoli",
  "mushroom",
];
addFamily(
  "soup",
  86,
  combinationsOf(soupBases, soupVegetables, vegetables).filter(
    ([base, vegetable, accent]) =>
      base !== accent && vegetable !== accent && base !== vegetable,
  ),
  ([base, vegetable, accent], index, id) =>
    createRecipe({
      id,
      titleDe: `Kräftige ${name(base, "de")}-${name(vegetable, "de")}-Suppe mit ${name(accent, "de")}`,
      titleEn: `Hearty ${name(base, "en")} and ${name(vegetable, "en")} soup with ${name(accent, "en")}`,
      ingredientLines: [
        amount(base, 350, "g", "g"),
        amount(vegetable, 220, "g", "g"),
        amount(accent, 180, "g", "g"),
        amount("vegetable-broth", 900, "ml", "ml"),
        amount("onion", 1, "Stück", "piece"),
        amount("tomato-paste", 1, "EL", "tbsp"),
        amount("olive-oil", 2, "EL", "tbsp"),
        amount(index % 2 ? "thyme" : "parsley", 2, "TL", "tsp"),
      ],
      prep: 16 + (index % 4),
      cook: 28 + (index % 12),
      difficulty: difficultyFor(index + 6),
      cuisine: index % 2 ? "cuisine-european" : "cuisine-modern",
      method: "method-pot",
      steps: [
        text(
          `${name(base, "de")}, ${name(vegetable, "de")} und ${name(accent, "de")} gleichmäßig würfeln.`,
          `Dice the ${name(base, "en")}, ${name(vegetable, "en")}, and ${name(accent, "en")} evenly.`,
        ),
        text(
          `Zwiebel in Olivenöl anschwitzen, Tomatenmark einrühren und kurz rösten.`,
          `Soften the onion in olive oil, stir in the tomato paste, and roast briefly.`,
        ),
        text(
          `Das vorbereitete Gemüse und die Brühe zugeben und köcheln, bis alle Zutaten weich sind.`,
          `Add the prepared vegetables and broth and simmer until all ingredients are tender.`,
        ),
        text(
          `Einen kleinen Teil der Suppe pürieren, wieder einrühren, mit Kräutern abschmecken und servieren.`,
          `Blend a small portion of the soup, stir it back in, season with herbs, and serve.`,
        ),
      ],
    }),
);

const trayBases = ["potato", "sweet-potato"];
const trayProteins = [
  "chickpea",
  "tofu",
  "chicken",
  "salmon",
  "feta",
  "white-bean",
];
addFamily(
  "tray",
  86,
  combinationsOf(trayBases, trayProteins, vegetables),
  ([base, protein, vegetable], index, id) =>
    createRecipe({
      id,
      titleDe: `Ofen-${name(base, "de")} mit ${name(protein, "de")} und ${name(vegetable, "de")}`,
      titleEn: `Roasted ${name(base, "en")} with ${name(protein, "en")} and ${name(vegetable, "en")}`,
      ingredientLines: [
        amount(base, 420, "g", "g"),
        amount(protein, 300, "g", "g"),
        amount(vegetable, 360, "g", "g"),
        amount("olive-oil", 3, "EL", "tbsp"),
        amount("lemon", 1, "Stück", "piece"),
        amount(index % 2 ? "rosemary" : "thyme", 2, "TL", "tsp"),
        amount("paprika-spice", 1, "TL", "tsp"),
        amount("black-pepper", 1, "Prise", "pinch"),
      ],
      prep: 15 + (index % 6),
      cook: 30 + (index % 15),
      difficulty: difficultyFor(index + 8),
      cuisine: "cuisine-mediterranean",
      method: "method-oven",
      steps: [
        text(
          `Den Backofen auf 200 °C Ober-/Unterhitze vorheizen und ein Blech vorbereiten.`,
          `Preheat the oven to 200°C/390°F conventional and prepare a baking tray.`,
        ),
        text(
          `${name(base, "de")} und ${name(vegetable, "de")} schneiden, mit Öl und Gewürzen mischen und auf dem Blech verteilen.`,
          `Cut the ${name(base, "en")} and ${name(vegetable, "en")}, toss with oil and spices, and spread on the tray.`,
        ),
        text(
          `Das Gemüse vorbacken, dann ${name(protein, "de")} ergänzen und alles vollständig garen.`,
          `Part-roast the vegetables, then add the ${name(protein, "en")} and cook everything through.`,
        ),
        text(
          `Mit Zitronensaft abrunden, kurz ruhen lassen und direkt vom Blech servieren.`,
          `Finish with lemon juice, let it rest briefly, and serve straight from the tray.`,
        ),
      ],
    }),
);

const saladBases = ["quinoa", "couscous", "bulgur", "spinach", "kale"];
const saladProteins = ["chickpea", "lentil", "white-bean", "tofu", "feta"];
const saladAccents = [
  "cucumber",
  "tomato",
  "bell-pepper",
  "carrot",
  "mango",
  "apple",
  "avocado",
];
addFamily(
  "salad",
  86,
  combinationsOf(saladBases, saladProteins, saladAccents),
  ([base, protein, accent], index, id) =>
    createRecipe({
      id,
      titleDe: `${name(base, "de")}-Salat mit ${name(protein, "de")} und ${name(accent, "de")}`,
      titleEn: `${name(base, "en")} salad with ${name(protein, "en")} and ${name(accent, "en")}`,
      ingredientLines: [
        amount(base, 260, "g", "g"),
        amount(protein, 260, "g", "g"),
        amount(accent, 240, "g", "g"),
        amount("cucumber", 180, "g", "g"),
        amount("olive-oil", 3, "EL", "tbsp"),
        amount("lemon", 1, "Stück", "piece"),
        amount("mustard", 1, "TL", "tsp"),
        amount(index % 2 ? "parsley" : "basil", 2, "EL", "tbsp"),
      ],
      prep: 17 + (index % 7),
      cook: 10 + (index % 12),
      difficulty: difficultyFor(index + 10),
      cuisine: index % 2 ? "cuisine-middle-eastern" : "cuisine-modern",
      method: "method-salad",
      steps: [
        text(
          `${name(base, "de")} bei Bedarf garen und vollständig abkühlen lassen.`,
          `Cook the ${name(base, "en")} if needed and let it cool completely.`,
        ),
        text(
          `${name(protein, "de")}, ${name(accent, "de")} und Gurke in mundgerechte Stücke schneiden.`,
          `Cut the ${name(protein, "en")}, ${name(accent, "en")}, and cucumber into bite-sized pieces.`,
        ),
        text(
          `Olivenöl, Zitronensaft und Senf zu einem glatten Dressing verrühren.`,
          `Whisk the olive oil, lemon juice, and mustard into a smooth dressing.`,
        ),
        text(
          `Alle Zutaten behutsam mischen, mit Kräutern abschmecken und kurz durchziehen lassen.`,
          `Gently combine all ingredients, season with herbs, and let the flavors mingle briefly.`,
        ),
      ],
    }),
);

const catalog = {
  version: 1,
  ingredients,
  facets: facetGroups,
  recipes,
};

await mkdir(dirname(outputPath), { recursive: true });
const serializedCatalog = await format(JSON.stringify(catalog), {
  parser: "json",
});
await writeFile(outputPath, serializedCatalog, "utf8");
console.log(
  `Generated ${recipes.length} original bilingual recipes at ${outputPath}`,
);
