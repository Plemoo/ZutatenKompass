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
  ingredient("sugar", "Zucker", "sugar", { staple: true }),
  ingredient("brown-sugar", "Brauner Zucker", "brown sugar", {
    parentId: "sugar",
  }),
  ingredient("baking-powder", "Backpulver", "baking powder", {
    staple: true,
  }),
  ingredient("baking-soda", "Natron", "baking soda", { staple: true }),
  ingredient("yeast", "Hefe", "yeast"),
  ingredient("vanilla", "Vanille", "vanilla", {
    deAliases: ["Vanilleextrakt"],
    enAliases: ["vanilla extract"],
    staple: true,
  }),
  ingredient("cinnamon", "Zimt", "cinnamon", { staple: true }),
  ingredient("cocoa", "Kakaopulver", "cocoa powder", {
    deAliases: ["Kakao"],
  }),
  ingredient("chocolate", "Schokolade", "chocolate"),
  ingredient("dark-chocolate", "Zartbitterschokolade", "dark chocolate", {
    parentId: "chocolate",
  }),
  ingredient("white-chocolate", "Weiße Schokolade", "white chocolate", {
    parentId: "chocolate",
  }),
  ingredient("oat", "Haferflocke", "oat", {
    parentId: "grain",
    deAliases: ["Haferflocken"],
    enAliases: ["oats", "rolled oats"],
  }),
  ingredient("cornstarch", "Speisestärke", "cornstarch", {
    staple: true,
  }),
  ingredient("banana", "Banane", "banana", {
    parentId: "fruit",
    deAliases: ["Bananen"],
    enAliases: ["bananas"],
  }),
  ingredient("orange", "Orange", "orange", {
    parentId: "fruit",
    deAliases: ["Orangen"],
    enAliases: ["oranges"],
  }),
  ingredient("berry", "Beere", "berry", {
    parentId: "fruit",
    deAliases: ["Beeren"],
    enAliases: ["berries"],
  }),
  ingredient("blueberry", "Heidelbeere", "blueberry", {
    parentId: "berry",
    deAliases: ["Blaubeere", "Heidelbeeren", "Blaubeeren"],
    enAliases: ["blueberries"],
  }),
  ingredient("raspberry", "Himbeere", "raspberry", {
    parentId: "berry",
    deAliases: ["Himbeeren"],
    enAliases: ["raspberries"],
  }),
  ingredient("strawberry", "Erdbeere", "strawberry", {
    parentId: "berry",
    deAliases: ["Erdbeeren"],
    enAliases: ["strawberries"],
  }),
  ingredient("cherry", "Kirsche", "cherry", {
    parentId: "fruit",
    deAliases: ["Kirschen"],
    enAliases: ["cherries"],
  }),
  ingredient("coconut-flakes", "Kokosraspel", "desiccated coconut", {
    deAliases: ["Kokosflocken"],
    enAliases: ["coconut flakes"],
  }),
];

const facetGroups = [
  {
    id: "meal",
    label: text("Mahlzeit", "Meal"),
    options: [
      ["meal-main", "Hauptgericht", "Main course"],
      ["meal-lunch", "Mittagessen", "Lunch", "meal-main"],
      ["meal-dinner", "Abendessen", "Dinner", "meal-main"],
      ["meal-breakfast", "Frühstück", "Breakfast"],
      ["meal-snack", "Snack und Kleinigkeit", "Snack and light bite"],
      ["meal-dessert", "Dessert und Gebäck", "Dessert and baking"],
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
      ["cuisine-east-asian", "Ostasiatisch", "East Asian", "cuisine-asian"],
      [
        "cuisine-southeast-asian",
        "S\u00fcdostasiatisch",
        "Southeast Asian",
        "cuisine-asian",
      ],
      ["cuisine-indian", "Indisch", "Indian", "cuisine-asian"],
      ["cuisine-middle-eastern", "Nahöstlich", "Middle Eastern"],
      ["cuisine-european", "Europäisch", "European"],
      ["cuisine-modern", "Modern", "Modern"],
      ["cuisine-african", "Afrikanisch", "African"],
      ["cuisine-american", "Amerikanisch", "American"],
      [
        "cuisine-latin-american",
        "Lateinamerikanisch",
        "Latin American",
        "cuisine-american",
      ],
      ["cuisine-mexican", "Mexikanisch", "Mexican", "cuisine-latin-american"],
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
      ["method-casserole", "Auflauf", "Casserole"],
      ["method-stew", "Eintopf und Schmoren", "Stew and braise"],
      ["method-baking", "Backen", "Baking"],
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
  "dark-chocolate",
  "honey",
  "white-chocolate",
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
  meal,
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
      meal ?? (total <= 35 ? "meal-lunch" : "meal-dinner"),
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
  138,
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
      cuisine: [
        "cuisine-mediterranean",
        "cuisine-modern",
        "cuisine-middle-eastern",
        "cuisine-mexican",
        "cuisine-latin-american",
      ][index % 5],
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
  120,
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
      cuisine: ["cuisine-mediterranean", "cuisine-european"][index % 2],
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
  120,
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
      cuisine: [
        "cuisine-indian",
        "cuisine-southeast-asian",
        "cuisine-east-asian",
      ][index % 3],
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
        ...(criticalProteins.has(protein)
          ? [
              text(
                cookingGuidance(protein, "de").trim(),
                cookingGuidance(protein, "en").trim(),
              ),
            ]
          : []),
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
  175,
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
      cuisine: ["cuisine-european", "cuisine-modern", "cuisine-african"][
        index % 3
      ],
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
  120,
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
      cuisine: ["cuisine-mediterranean", "cuisine-american"][index % 2],
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
        ...(criticalProteins.has(protein)
          ? [
              text(
                cookingGuidance(protein, "de").trim(),
                cookingGuidance(protein, "en").trim(),
              ),
            ]
          : []),
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
  175,
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
      cuisine: [
        "cuisine-middle-eastern",
        "cuisine-modern",
        "cuisine-latin-american",
      ][index % 3],
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

const casseroleBases = [
  "potato",
  "sweet-potato",
  "penne",
  "brown-rice",
  "quinoa",
];
const casseroleProteins = [
  "chickpea",
  "lentil",
  "white-bean",
  "tofu",
  "chicken",
  "salmon",
  "feta",
  "mozzarella",
];
addFamily(
  "casserole",
  240,
  combinationsOf(casseroleBases, casseroleProteins, vegetables),
  ([base, protein, vegetable], index, id) =>
    createRecipe({
      id,
      titleDe: `${name(base, "de")}-Auflauf mit ${name(protein, "de")} und ${name(vegetable, "de")}`,
      titleEn: `${name(base, "en")} casserole with ${name(protein, "en")} and ${name(vegetable, "en")}`,
      ingredientLines: [
        amount(base, 420, "g", "g"),
        amount(protein, 280, "g", "g"),
        amount(vegetable, 340, "g", "g"),
        amount("cream", 180, "ml", "ml"),
        amount("mozzarella", 140, "g", "g"),
        amount("onion", 1, "Stück", "piece"),
        amount("garlic", 2, "Zehen", "cloves"),
        amount("thyme", 2, "TL", "tsp"),
        amount("black-pepper", 1, "Prise", "pinch"),
      ],
      prep: 18 + (index % 7),
      cook: 34 + (index % 13),
      difficulty: difficultyFor(index + 12),
      cuisine: ["cuisine-european", "cuisine-modern", "cuisine-american"][
        index % 3
      ],
      method: "method-casserole",
      steps: [
        text(
          `Den Backofen auf 190 °C Ober-/Unterhitze vorheizen und eine Auflaufform einfetten.`,
          `Preheat the oven to 190°C/375°F conventional and grease a casserole dish.`,
        ),
        text(
          `${name(base, "de")} vorbereiten, ${name(vegetable, "de")} schneiden und beides mit Zwiebel und Knoblauch in die Form geben.`,
          `Prepare the ${name(base, "en")}, cut the ${name(vegetable, "en")}, and place both in the dish with onion and garlic.`,
        ),
        text(
          `${name(protein, "de")} untermischen, Sahne würzen und darübergießen.${cookingGuidance(protein, "de")}`,
          `Fold in the ${name(protein, "en")}, season the cream, and pour it over.${cookingGuidance(protein, "en")}`,
        ),
        text(
          `Mit Mozzarella bestreuen und backen, bis der Auflauf durchgegart und goldbraun ist; vor dem Servieren fünf Minuten ruhen lassen.`,
          `Top with mozzarella and bake until the casserole is cooked through and golden; rest for five minutes before serving.`,
        ),
      ],
    }),
);

const stewProteins = [
  "chickpea",
  "lentil",
  "kidney-bean",
  "tofu",
  "chicken",
  "beef",
  "pork",
];
const stewAccents = [
  "potato",
  "sweet-potato",
  "leek",
  "celery",
  "cabbage",
  "pea",
  "corn",
  "green-bean",
];
addFamily(
  "stew",
  240,
  combinationsOf(stewProteins, vegetables, stewAccents).filter(
    ([, vegetable, accent]) => vegetable !== accent,
  ),
  ([protein, vegetable, accent], index, id) =>
    createRecipe({
      id,
      titleDe: `Geschmorter ${name(protein, "de")}-${name(vegetable, "de")}-Eintopf mit ${name(accent, "de")}`,
      titleEn: `Braised ${name(protein, "en")} and ${name(vegetable, "en")} stew with ${name(accent, "en")}`,
      ingredientLines: [
        amount(protein, 320, "g", "g"),
        amount(vegetable, 300, "g", "g"),
        amount(accent, 260, "g", "g"),
        amount("vegetable-broth", 850, "ml", "ml"),
        amount("canned-tomato", 400, "g", "g"),
        amount("onion", 1, "Stück", "piece"),
        amount("garlic", 2, "Zehen", "cloves"),
        amount(index % 2 ? "rosemary" : "thyme", 2, "TL", "tsp"),
        amount("olive-oil", 2, "EL", "tbsp"),
      ],
      prep: 17 + (index % 6),
      cook: 38 + (index % 18),
      difficulty: difficultyFor(index + 14),
      cuisine: [
        "cuisine-european",
        "cuisine-african",
        "cuisine-indian",
        "cuisine-latin-american",
      ][index % 4],
      method: "method-stew",
      steps: [
        text(
          `${name(protein, "de")}, ${name(vegetable, "de")} und ${name(accent, "de")} gleichmäßig vorbereiten und getrennt bereithalten.`,
          `Prepare the ${name(protein, "en")}, ${name(vegetable, "en")}, and ${name(accent, "en")} evenly and keep them separate.`,
        ),
        text(
          `Zwiebel und Knoblauch in Olivenöl anschwitzen, dann ${name(protein, "de")} kräftig anrösten.`,
          `Soften the onion and garlic in olive oil, then brown the ${name(protein, "en")} thoroughly.`,
        ),
        text(
          `Gemüse, Dosentomaten und Brühe zugeben und den Eintopf bei kleiner Hitze zugedeckt schmoren.${cookingGuidance(protein, "de")}`,
          `Add the vegetables, canned tomatoes, and broth, then gently braise the covered stew.${cookingGuidance(protein, "en")}`,
        ),
        text(
          `Den Deckel abnehmen, die Konsistenz einige Minuten einkochen, mit Kräutern abschmecken und heiß servieren.`,
          `Remove the lid, reduce to the desired consistency for a few minutes, season with herbs, and serve hot.`,
        ),
      ],
    }),
);

const bakingFruits = [
  "apple",
  "pear",
  "banana",
  "mango",
  "blueberry",
  "raspberry",
  "strawberry",
  "cherry",
  "orange",
];
const bakingFlavors = ["vanilla", "cinnamon", "cocoa", "lemon", "orange"];
const bakingToppings = ["almond", "walnut", "dark-chocolate", "coconut-flakes"];
const flavorLine = (ingredientId) =>
  ingredientId === "cocoa"
    ? amount(ingredientId, 30, "g", "g")
    : ["lemon", "orange"].includes(ingredientId)
      ? amount(ingredientId, 1, "Stück", "piece")
      : amount(ingredientId, 2, "TL", "tsp");

addFamily(
  "cake",
  176,
  combinationsOf(bakingFruits, bakingFlavors, bakingToppings).filter(
    ([fruit, flavor]) => fruit !== flavor,
  ),
  ([fruit, flavor, topping], index, id) =>
    createRecipe({
      id,
      titleDe: `Saftiger ${name(fruit, "de")}-${name(flavor, "de")}-Kuchen mit ${name(topping, "de")}`,
      titleEn: `Moist ${name(fruit, "en")} and ${name(flavor, "en")} cake with ${name(topping, "en")}`,
      ingredientLines: [
        amount("flour", 320, "g", "g"),
        amount("sugar", 180, "g", "g"),
        amount("egg", 4, "Stück", "pieces"),
        amount("butter", 160, "g", "g"),
        amount("milk", 120, "ml", "ml"),
        amount("baking-powder", 3, "TL", "tsp"),
        amount(fruit, 260, "g", "g"),
        flavorLine(flavor),
        amount(topping, 80, "g", "g"),
        amount("salt", 1, "Prise", "pinch"),
      ],
      prep: 22 + (index % 8),
      cook: 42 + (index % 14),
      difficulty: difficultyFor(index + 16),
      cuisine: ["cuisine-european", "cuisine-american"][index % 2],
      method: "method-baking",
      meal: "meal-dessert",
      steps: [
        text(
          `Den Backofen auf 175 °C Ober-/Unterhitze vorheizen, eine Form fetten und mit etwas Mehl ausstäuben.`,
          `Preheat the oven to 175°C/350°F conventional, grease a cake tin, and dust it lightly with flour.`,
        ),
        text(
          `Butter und Zucker cremig rühren, die Eier einzeln einarbeiten und anschließend Milch zugeben.`,
          `Cream the butter and sugar, beat in the eggs one at a time, and then add the milk.`,
        ),
        text(
          `Mehl, Backpulver, Salz und ${name(flavor, "de")} mischen und nur kurz unter die feuchten Zutaten heben.`,
          `Combine the flour, baking powder, salt, and ${name(flavor, "en")}, then briefly fold them into the wet ingredients.`,
        ),
        text(
          `${name(fruit, "de")} vorbereiten, mit ${name(topping, "de")} unterheben und den Teig gleichmäßig in der Form verteilen.`,
          `Prepare the ${name(fruit, "en")}, fold it in with the ${name(topping, "en")}, and spread the batter evenly in the tin.`,
        ),
        text(
          `Backen, bis ein Holzstäbchen ohne feuchten Teig herauskommt; den Kuchen vollständig abkühlen lassen und erst dann anschneiden.`,
          `Bake until a skewer comes out without wet batter; cool the cake completely before slicing.`,
        ),
      ],
    }),
);

addFamily(
  "muffin",
  176,
  combinationsOf(bakingFruits, bakingFlavors, bakingToppings).filter(
    ([fruit, flavor]) => fruit !== flavor,
  ),
  ([fruit, flavor, topping], index, id) =>
    createRecipe({
      id,
      titleDe: `${name(fruit, "de")}-${name(flavor, "de")}-Muffins mit ${name(topping, "de")}`,
      titleEn: `${name(fruit, "en")} and ${name(flavor, "en")} muffins with ${name(topping, "en")}`,
      ingredientLines: [
        amount("flour", 280, "g", "g"),
        amount("brown-sugar", 150, "g", "g"),
        amount("egg", 2, "Stück", "pieces"),
        amount("milk", 220, "ml", "ml"),
        amount("neutral-oil", 100, "ml", "ml"),
        amount("baking-powder", 2, "TL", "tsp"),
        amount("baking-soda", 1, "TL", "tsp"),
        amount(fruit, 220, "g", "g"),
        flavorLine(flavor),
        amount(topping, 70, "g", "g"),
      ],
      prep: 18 + (index % 7),
      cook: 24 + (index % 8),
      difficulty: difficultyFor(index + 18),
      cuisine: ["cuisine-modern", "cuisine-american"][index % 2],
      method: "method-baking",
      meal: ["meal-breakfast", "meal-snack", "meal-breakfast", "meal-dessert"][
        index % 4
      ],
      steps: [
        text(
          `Den Backofen auf 180 °C Ober-/Unterhitze vorheizen und ein Muffinblech mit Papierförmchen auslegen.`,
          `Preheat the oven to 180°C/355°F conventional and line a muffin tin with paper cases.`,
        ),
        text(
          `Mehl, Backpulver, Natron, braunen Zucker und ${name(flavor, "de")} in einer großen Schüssel gründlich mischen.`,
          `Thoroughly combine the flour, baking powder, baking soda, brown sugar, and ${name(flavor, "en")} in a large bowl.`,
        ),
        text(
          `Eier, Milch und Öl separat verrühren und nur so lange unter die trockenen Zutaten ziehen, bis kein loses Mehl mehr sichtbar ist.`,
          `Whisk the eggs, milk, and oil separately, then fold into the dry ingredients only until no loose flour remains.`,
        ),
        text(
          `${name(fruit, "de")} und ${name(topping, "de")} vorsichtig unterheben und den Teig gleichmäßig auf die Förmchen verteilen.`,
          `Gently fold in the ${name(fruit, "en")} and ${name(topping, "en")}, then divide the batter evenly among the cases.`,
        ),
        text(
          `Die Muffins goldbraun backen, mit der Stäbchenprobe prüfen und vor dem Servieren auf einem Gitter abkühlen lassen.`,
          `Bake the muffins until golden, check them with a skewer, and cool them on a rack before serving.`,
        ),
      ],
    }),
);

const lunchConcepts = {
  oven: [
    [
      "gemuese-lasagne",
      "Gemüse-Lasagne",
      "Vegetable lasagna",
      "pasta",
      "zucchini",
    ],
    ["moussaka", "Moussaka", "Moussaka", "eggplant", "potato"],
    ["shepherds-pie", "Shepherd’s Pie", "Shepherd’s pie", "beef", "potato"],
    ["fisch-pie", "Fisch-Pie", "Fish pie", "cod", "potato"],
    [
      "gefuellte-paprika",
      "Gefüllte Paprika",
      "Stuffed peppers",
      "bell-pepper",
      "quinoa",
    ],
    [
      "gefuellte-zucchini",
      "Gefüllte Zucchini",
      "Stuffed zucchini",
      "zucchini",
      "lentil",
    ],
    [
      "auberginen-parmigiana",
      "Auberginen-Parmigiana",
      "Eggplant parmigiana",
      "eggplant",
      "parmesan",
    ],
    [
      "haehnchen-parmigiana",
      "Hähnchen-Parmigiana",
      "Chicken parmigiana",
      "chicken",
      "parmesan",
    ],
    [
      "lachs-pergament",
      "Lachs aus dem Pergament",
      "Salmon en papillote",
      "salmon",
      "lemon",
    ],
    [
      "kabeljau-kraeuterkruste",
      "Kabeljau mit Kräuterkruste",
      "Herb-crusted cod",
      "cod",
      "bread",
    ],
    ["hackbraten", "Saftiger Hackbraten", "Juicy meatloaf", "beef", "egg"],
    [
      "pilz-ofenrisotto",
      "Pilz-Ofenrisotto",
      "Baked mushroom risotto",
      "brown-rice",
      "mushroom",
    ],
    [
      "brokkoli-gratin",
      "Brokkoli-Gratin",
      "Broccoli gratin",
      "broccoli",
      "cheddar",
    ],
    [
      "blumenkohl-kaese",
      "Blumenkohl in Käsesauce",
      "Cauliflower cheese",
      "cauliflower",
      "gouda",
    ],
    [
      "spinat-feta-quiche",
      "Spinat-Feta-Quiche",
      "Spinach and feta quiche",
      "spinach",
      "feta",
    ],
    [
      "kartoffelgratin",
      "Klassisches Kartoffelgratin",
      "Classic potato gratin",
      "potato",
      "cream",
    ],
    [
      "suesskartoffelgratin",
      "Süßkartoffelgratin",
      "Sweet potato gratin",
      "sweet-potato",
      "cream",
    ],
    [
      "bohnen-enchiladas",
      "Bohnen-Enchiladas",
      "Bean enchiladas",
      "tortilla",
      "kidney-bean",
    ],
    [
      "kuerbis-feta",
      "Gebackener Kürbis mit Feta",
      "Baked pumpkin with feta",
      "pumpkin",
      "feta",
    ],
    [
      "ofen-frittata",
      "Ofen-Frittata mit Spargel",
      "Baked asparagus frittata",
      "egg",
      "asparagus",
    ],
    [
      "ofen-ratatouille",
      "Ratatouille aus dem Ofen",
      "Oven-baked ratatouille",
      "zucchini",
      "eggplant",
    ],
    [
      "blech-falafel",
      "Blech-Falafel",
      "Sheet-pan falafel",
      "chickpea",
      "sesame",
    ],
    [
      "knuspertofu",
      "Knuspriger Ofen-Tofu",
      "Crispy baked tofu",
      "tofu",
      "cornstarch",
    ],
    [
      "lauch-kartoffel-pie",
      "Lauch-Kartoffel-Pie",
      "Leek and potato pie",
      "leek",
      "potato",
    ],
    [
      "kohlrouladen",
      "Kohlrouladen aus dem Ofen",
      "Oven-baked cabbage rolls",
      "cabbage",
      "beef",
    ],
    [
      "penne-al-forno",
      "Penne al forno",
      "Penne al forno",
      "penne",
      "mozzarella",
    ],
    [
      "feta-pasta",
      "Gebackene Feta-Pasta",
      "Baked feta pasta",
      "spaghetti",
      "feta",
    ],
    [
      "brathaehnchen",
      "Kräuter-Brathähnchen",
      "Herb-roasted chicken",
      "chicken",
      "rosemary",
    ],
    [
      "senf-schweinebraten",
      "Senf-Schweinebraten",
      "Mustard roast pork",
      "pork",
      "mustard",
    ],
    [
      "gemuese-pastete",
      "Gemüse-Pastete",
      "Vegetable pie",
      "cauliflower",
      "pea",
    ],
  ],
  pot: [
    [
      "chili-con-carne",
      "Chili con Carne",
      "Chili con carne",
      "beef",
      "kidney-bean",
    ],
    [
      "chili-sin-carne",
      "Chili sin Carne",
      "Vegetarian chili",
      "lentil",
      "kidney-bean",
    ],
    ["rindergulasch", "Rindergulasch", "Beef goulash", "beef", "bell-pepper"],
    [
      "boeuf-bourguignon",
      "Boeuf Bourguignon",
      "Boeuf bourguignon",
      "beef",
      "mushroom",
    ],
    [
      "haehnchenfrikassee",
      "Hähnchenfrikassee",
      "Chicken fricassee",
      "chicken",
      "pea",
    ],
    [
      "pilzrisotto",
      "Cremiges Pilzrisotto",
      "Creamy mushroom risotto",
      "brown-rice",
      "mushroom",
    ],
    [
      "kuerbisrisotto",
      "Kürbisrisotto",
      "Pumpkin risotto",
      "brown-rice",
      "pumpkin",
    ],
    [
      "linsendal",
      "Rotes Linsendal",
      "Red lentil dal",
      "lentil",
      "coconut-milk",
    ],
    ["butter-chicken", "Butter Chicken", "Butter chicken", "chicken", "butter"],
    [
      "tikka-masala",
      "Chicken Tikka Masala",
      "Chicken tikka masala",
      "chicken",
      "yogurt",
    ],
    [
      "thai-curry",
      "Grünes Gemüse-Curry",
      "Green vegetable curry",
      "tofu",
      "coconut-milk",
    ],
    [
      "kichererbsen-tagine",
      "Kichererbsen-Tajine",
      "Chickpea tagine",
      "chickpea",
      "carrot",
    ],
    ["jambalaya", "Jambalaya", "Jambalaya", "brown-rice", "shrimp"],
    ["paella", "Gemüse-Paella", "Vegetable paella", "brown-rice", "green-bean"],
    [
      "erbseneintopf",
      "Klassischer Erbseneintopf",
      "Classic pea stew",
      "pea",
      "potato",
    ],
    ["minestrone", "Minestrone", "Minestrone", "white-bean", "pasta"],
    ["kartoffelsuppe", "Kartoffelsuppe", "Potato soup", "potato", "leek"],
    [
      "tomatensuppe",
      "Geröstete Tomatensuppe",
      "Roasted tomato soup",
      "tomato",
      "basil",
    ],
    [
      "kuerbissuppe",
      "Kürbis-Kokos-Suppe",
      "Pumpkin coconut soup",
      "pumpkin",
      "coconut-milk",
    ],
    [
      "fischsuppe",
      "Mediterrane Fischsuppe",
      "Mediterranean fish soup",
      "cod",
      "tomato",
    ],
    [
      "linsensuppe",
      "Linsensuppe mit Wurzelgemüse",
      "Lentil root vegetable soup",
      "lentil",
      "carrot",
    ],
    [
      "zwiebelsuppe",
      "Französische Zwiebelsuppe",
      "French onion soup",
      "onion",
      "bread",
    ],
    [
      "kohlrouladen-topf",
      "Geschmorte Kohlrouladen",
      "Braised cabbage rolls",
      "cabbage",
      "beef",
    ],
    ["rinderrouladen", "Rinderrouladen", "Beef roulades", "beef", "mustard"],
    ["stroganoff", "Beef Stroganoff", "Beef stroganoff", "beef", "mushroom"],
    ["ossobuco", "Ossobuco", "Ossobuco", "beef", "celery"],
    [
      "ratatouille-topf",
      "Geschmorte Ratatouille",
      "Braised ratatouille",
      "eggplant",
      "zucchini",
    ],
    [
      "weisse-bohnen",
      "Weiße Bohnen in Tomatensauce",
      "White beans in tomato sauce",
      "white-bean",
      "tomato",
    ],
    [
      "kokos-fisch",
      "Kokos-Fischtopf",
      "Coconut fish stew",
      "salmon",
      "coconut-milk",
    ],
    [
      "gemuese-couscous",
      "Gedämpfter Gemüse-Couscous",
      "Steamed vegetable couscous",
      "couscous",
      "cauliflower",
    ],
  ],
  pan: [
    [
      "jaegerschnitzel",
      "Jägerschnitzel",
      "Hunter-style schnitzel",
      "pork",
      "mushroom",
    ],
    [
      "haehnchen-schnitzel",
      "Hähnchenschnitzel",
      "Chicken schnitzel",
      "chicken",
      "bread",
    ],
    ["cordon-bleu", "Cordon bleu", "Cordon bleu", "pork", "gouda"],
    ["kartoffelpuffer", "Kartoffelpuffer", "Potato pancakes", "potato", "egg"],
    [
      "gemuesepuffer",
      "Gemüsepuffer",
      "Vegetable fritters",
      "zucchini",
      "carrot",
    ],
    ["fischfrikadellen", "Fischfrikadellen", "Fish cakes", "cod", "potato"],
    [
      "falafel-pfanne",
      "Pfannen-Falafel",
      "Pan-fried falafel",
      "chickpea",
      "parsley",
    ],
    [
      "gebratener-reis",
      "Gebratener Reis mit Gemüse",
      "Vegetable fried rice",
      "brown-rice",
      "pea",
    ],
    ["pad-thai", "Pad Thai", "Pad Thai", "pasta", "peanut"],
    ["yakisoba", "Yakisoba", "Yakisoba", "spaghetti", "cabbage"],
    [
      "schupfnudelpfanne",
      "Kartoffelnudel-Gemüsepfanne",
      "Potato noodle skillet",
      "potato",
      "cabbage",
    ],
    ["bauernomelett", "Bauernomelett", "Farmer’s omelette", "egg", "potato"],
    [
      "tortilla-espanola",
      "Tortilla Española",
      "Spanish tortilla",
      "egg",
      "onion",
    ],
    ["shakshuka", "Shakshuka", "Shakshuka", "egg", "tomato"],
    [
      "haehnchen-wok",
      "Hähnchen-Gemüse-Wok",
      "Chicken vegetable stir-fry",
      "chicken",
      "broccoli",
    ],
    [
      "tofu-wok",
      "Tofu-Wok mit Sesam",
      "Sesame tofu stir-fry",
      "tofu",
      "sesame",
    ],
    [
      "rind-paprika",
      "Rindfleisch-Paprika-Pfanne",
      "Beef and pepper skillet",
      "beef",
      "bell-pepper",
    ],
    [
      "lachs-spinat",
      "Lachs auf Rahmspinat",
      "Salmon with creamy spinach",
      "salmon",
      "spinach",
    ],
    [
      "garnelen-knoblauch",
      "Knoblauch-Garnelen",
      "Garlic shrimp",
      "shrimp",
      "lemon",
    ],
    [
      "kabeljau-senf",
      "Kabeljau mit Senfsauce",
      "Cod with mustard sauce",
      "cod",
      "mustard",
    ],
    ["koettbullar", "Köttbullar", "Swedish meatballs", "beef", "cream"],
    [
      "frikadellen",
      "Klassische Frikadellen",
      "Classic meat patties",
      "beef",
      "bread",
    ],
    [
      "zucchini-piccata",
      "Zucchini-Piccata",
      "Zucchini piccata",
      "zucchini",
      "parmesan",
    ],
    [
      "auberginen-steaks",
      "Auberginen-Steaks",
      "Eggplant steaks",
      "eggplant",
      "sesame",
    ],
    [
      "pilzrahm-pfanne",
      "Pilzrahm-Pfanne",
      "Creamy mushroom skillet",
      "mushroom",
      "cream",
    ],
    [
      "gnocchi-ersatz",
      "Knusprige Kartoffelwürfel mit Spinat",
      "Crispy potatoes with spinach",
      "potato",
      "spinach",
    ],
    [
      "bohnen-tomaten",
      "Grüne-Bohnen-Tomaten-Pfanne",
      "Green bean tomato skillet",
      "green-bean",
      "tomato",
    ],
    [
      "brokkoli-nudel",
      "Brokkoli-Nudelpfanne",
      "Broccoli pasta skillet",
      "penne",
      "broccoli",
    ],
    [
      "couscous-pfanne",
      "Couscous-Pfanne mit Kichererbsen",
      "Couscous chickpea skillet",
      "couscous",
      "chickpea",
    ],
    [
      "suesskartoffel-hash",
      "Süßkartoffel-Hash",
      "Sweet potato hash",
      "sweet-potato",
      "bell-pepper",
    ],
  ],
};

const lunchTechniques = {
  oven: [
    "oven-layer-and-bake",
    "oven-fill-and-roast",
    "oven-gratinate",
    "oven-en-papillote",
    "oven-crust-and-bake",
    "oven-slow-roast",
    "oven-set-custard",
    "oven-braise-covered",
    "oven-parbake-and-finish",
    "oven-high-heat-crisp",
  ],
  pot: [
    "pot-simmer",
    "pot-braise",
    "pot-risotto",
    "pot-poach",
    "pot-steam",
    "pot-reduce",
    "pot-blanch-and-bind",
    "pot-one-pot-layer",
    "pot-slow-stew",
    "pot-emulsify",
  ],
  pan: [
    "pan-sear",
    "pan-saute",
    "pan-stir-fry",
    "pan-shallow-fry",
    "pan-set-egg",
    "pan-braise",
    "pan-reduce-sauce",
    "pan-toast-and-fold",
    "pan-crisp",
    "pan-steam-fry",
  ],
};

const techniqueDirections = {
  "oven-layer-and-bake": text(
    "Die Bestandteile abwechselnd mit der aromatischen Flüssigkeit einschichten, damit klar getrennte, saftige Lagen entstehen.",
    "Layer the components alternately with the aromatic liquid so that distinct, moist layers form.",
  ),
  "oven-fill-and-roast": text(
    "Die größere Zutat aushöhlen, die würzige Füllung locker einbringen und aufrecht in die Form setzen.",
    "Hollow out the larger ingredient, spoon in the seasoned filling loosely, and place it upright in the dish.",
  ),
  "oven-gratinate": text(
    "Alles flach in der Form verteilen und die Oberfläche so vorbereiten, dass sie beim Backen gleichmäßig gratiniert.",
    "Spread everything evenly in the dish and prepare the surface so that it gratinates uniformly.",
  ),
  "oven-en-papillote": text(
    "Die portionierten Zutaten auf Backpapier setzen, dicht zu Päckchen verschließen und im eigenen Dampf garen.",
    "Place individual portions on baking paper, seal tightly into parcels, and cook them in their own steam.",
  ),
  "oven-crust-and-bake": text(
    "Eine würzige Kruste herstellen, gleichmäßig andrücken und backen, bis sie trocken und goldbraun ist.",
    "Make a seasoned crust, press it on evenly, and bake until dry and golden.",
  ),
  "oven-slow-roast": text(
    "Die Zutaten kompakt in den Bräter setzen und bei gleichmäßiger Hitze langsam bis zum saftigen Kern rösten.",
    "Arrange the ingredients snugly in the roasting dish and roast steadily until the centre remains juicy.",
  ),
  "oven-set-custard": text(
    "Die vorbereiteten Zutaten mit der Eiermasse umgießen und ohne starke Bräunung sanft stocken lassen.",
    "Pour the egg mixture over the prepared ingredients and let it set gently without excessive browning.",
  ),
  "oven-braise-covered": text(
    "Die Form zunächst dicht abdecken, im entstehenden Dampf schmoren und erst zum Bräunen wieder öffnen.",
    "Cover the dish tightly at first, braise in the trapped steam, and uncover only for browning.",
  ),
  "oven-parbake-and-finish": text(
    "Die tragende Komponente zuerst vorgaren, anschließend belegen und für eine saftige Mitte fertigbacken.",
    "Part-bake the supporting component first, add the topping, and finish baking for a moist centre.",
  ),
  "oven-high-heat-crisp": text(
    "Mit Abstand auf dem heißen Blech verteilen, einmal wenden und bei hoher Hitze rundum knusprig rösten.",
    "Space everything out on the hot tray, turn once, and roast at high heat until crisp all over.",
  ),
  "pot-simmer": text(
    "Knapp unter dem Siedepunkt sanft köcheln, damit die Zutaten ihre Form behalten und Aromen austauschen.",
    "Keep at a gentle simmer just below boiling so the ingredients hold their shape while exchanging flavours.",
  ),
  "pot-braise": text(
    "Nach dem Anrösten nur teilweise mit Flüssigkeit bedecken und bei kleiner Hitze langsam weich schmoren.",
    "After browning, cover only partly with liquid and braise slowly over low heat until tender.",
  ),
  "pot-risotto": text(
    "Die Brühe portionsweise einarbeiten und regelmäßig rühren, bis die Körner cremig gebunden und bissfest sind.",
    "Work in the broth a little at a time, stirring regularly until the grains are creamy yet retain bite.",
  ),
  "pot-poach": text(
    "In nur leicht bewegter Flüssigkeit schonend gar ziehen lassen, ohne das Gargut sprudelnd zu kochen.",
    "Poach gently in barely moving liquid without allowing the food to boil vigorously.",
  ),
  "pot-steam": text(
    "Über wenig Flüssigkeit zugedeckt dämpfen, sodass Dampf und austretende Säfte das Gericht garen.",
    "Steam covered over a small amount of liquid so that steam and released juices cook the dish.",
  ),
  "pot-reduce": text(
    "Offen einkochen, bis die Flüssigkeit die Zutaten glänzend umhüllt und der Geschmack konzentriert ist.",
    "Reduce uncovered until the liquid coats the ingredients glossily and the flavour is concentrated.",
  ),
  "pot-blanch-and-bind": text(
    "Die festen Zutaten kurz blanchieren, abgießen und erst anschließend in der Sauce fertig binden.",
    "Briefly blanch the firm ingredients, drain, and only then finish binding them in the sauce.",
  ),
  "pot-one-pot-layer": text(
    "Die Zutaten nach Garzeit gestaffelt in einen Topf geben, damit am Ende alles gleichzeitig fertig ist.",
    "Add the ingredients to one pot in order of cooking time so everything finishes together.",
  ),
  "pot-slow-stew": text(
    "Bei sehr kleiner Hitze lange schmoren und nur gelegentlich bewegen, bis eine sämige Konsistenz entsteht.",
    "Stew slowly over very low heat, stirring only occasionally, until the consistency becomes rich.",
  ),
  "pot-emulsify": text(
    "Zum Schluss Fett und Kochflüssigkeit kräftig verbinden, bis eine glatte, stabile Sauce entsteht.",
    "Finish by vigorously combining fat and cooking liquid until a smooth, stable sauce forms.",
  ),
  "pan-sear": text(
    "Auf der ersten Seite ungestört kräftig anbraten, erst bei guter Kruste wenden und dann fertig garen.",
    "Sear undisturbed on the first side, turn only once a good crust has formed, then finish cooking.",
  ),
  "pan-saute": text(
    "In wenig Fett unter häufigem Schwenken kurz sautieren, damit Farbe und Biss erhalten bleiben.",
    "Sauté briefly in a little fat, tossing often so colour and bite are retained.",
  ),
  "pan-stir-fry": text(
    "Bei sehr hoher Hitze in kleinen Portionen wokken und die Zutaten nach ihrer Garzeit zufügen.",
    "Stir-fry in small batches over very high heat, adding ingredients according to their cooking time.",
  ),
  "pan-shallow-fry": text(
    "In einer flachen Ölschicht portionsweise goldbraun ausbacken und anschließend gründlich abtropfen lassen.",
    "Shallow-fry in batches until golden, then drain thoroughly.",
  ),
  "pan-set-egg": text(
    "Die Eiermasse bei mittlerer Hitze langsam stocken lassen und die Pfanne dabei nur behutsam bewegen.",
    "Let the egg mixture set slowly over medium heat, moving the pan only gently.",
  ),
  "pan-braise": text(
    "Nach dem Anbraten wenig Flüssigkeit zugeben, abdecken und in der Pfanne sanft fertig schmoren.",
    "After searing, add a little liquid, cover, and finish with a gentle pan braise.",
  ),
  "pan-reduce-sauce": text(
    "Den Bratensatz lösen und die Sauce offen reduzieren, bis sie die Zutaten dünn überzieht.",
    "Release the browned bits and reduce the sauce uncovered until it lightly coats the ingredients.",
  ),
  "pan-toast-and-fold": text(
    "Die trockenen Bestandteile zunächst anrösten, dann die übrigen Zutaten locker unterheben.",
    "Toast the dry components first, then fold in the remaining ingredients loosely.",
  ),
  "pan-crisp": text(
    "Flach in die Pfanne drücken, ohne Bewegen knusprig werden lassen und in großen Stücken wenden.",
    "Press flat into the pan, leave undisturbed until crisp, and turn in large pieces.",
  ),
  "pan-steam-fry": text(
    "Zuerst mit wenig Flüssigkeit zugedeckt dämpfen, dann den Deckel entfernen und trocken anbraten.",
    "Steam covered with a little liquid first, then remove the lid and fry until dry.",
  ),
};

function conceptAmount(ingredientId, position) {
  if (ingredientId === "egg") return amount(ingredientId, 4, "Stück", "pieces");
  if (ingredientId === "tortilla")
    return amount(ingredientId, 8, "Stück", "pieces");
  if (["lemon", "onion"].includes(ingredientId))
    return amount(ingredientId, position === 0 ? 2 : 1, "Stück", "pieces");
  if (["rosemary", "parsley", "basil"].includes(ingredientId))
    return amount(ingredientId, 2, "EL", "tbsp");
  if (["mustard", "sesame", "cornstarch"].includes(ingredientId))
    return amount(ingredientId, 2, "EL", "tbsp");
  if (ingredientId === "peanut") return amount(ingredientId, 80, "g", "g");
  if (
    ["bread", "parmesan", "cheddar", "gouda", "feta", "mozzarella"].includes(
      ingredientId,
    )
  )
    return amount(ingredientId, 140, "g", "g");
  if (["cream", "coconut-milk"].includes(ingredientId))
    return amount(ingredientId, 250, "ml", "ml");
  return amount(ingredientId, position === 0 ? 420 : 280, "g", "g");
}

function lunchSteps(method, primary, secondary, technique) {
  const safetyDe = `${cookingGuidance(primary, "de")}${cookingGuidance(secondary, "de")}`;
  const safetyEn = `${cookingGuidance(primary, "en")}${cookingGuidance(secondary, "en")}`;
  const first = text(
    `${name(primary, "de")} und ${name(secondary, "de")} passend zur jeweiligen Form vorbereiten; Zwiebel und Knoblauch fein schneiden.`,
    `Prepare the ${name(primary, "en")} and ${name(secondary, "en")} for the dish; finely chop the onion and garlic.`,
  );
  if (method === "oven") {
    return [
      first,
      text(
        `Den Backofen auf 190 °C Ober-/Unterhitze vorheizen und die Form dünn mit Olivenöl ausstreichen.`,
        `Preheat the oven to 190°C/375°F conventional and lightly oil the baking dish.`,
      ),
      text(
        `Zwiebel und Knoblauch anschwitzen, mit Brühe ablöschen und die aromatische Grundlage sorgfältig abschmecken.`,
        `Soften the onion and garlic, deglaze with broth, and season the aromatic base carefully.`,
      ),
      text(
        `${techniqueDirections[technique].de}${safetyDe}`,
        `${techniqueDirections[technique].en}${safetyEn}`,
      ),
      text(
        `Im Ofen garen, bis die Mitte heiß und die Oberfläche appetitlich gebräunt ist; vor dem Servieren fünf Minuten ruhen lassen.`,
        `Bake until the centre is hot and the surface is nicely browned; rest for five minutes before serving.`,
      ),
    ];
  }
  if (method === "pot") {
    return [
      first,
      text(
        `Zwiebel und Knoblauch in Olivenöl glasig anschwitzen und die festen Zutaten kurz mitrösten.`,
        `Soften the onion and garlic in olive oil, then briefly toast the firm ingredients.`,
      ),
      text(
        `Mit Brühe ablöschen, ${name(primary, "de")} und ${name(secondary, "de")} zugeben und die Hitze kontrolliert reduzieren.`,
        `Deglaze with broth, add the ${name(primary, "en")} and ${name(secondary, "en")}, and reduce the heat carefully.`,
      ),
      text(
        `${techniqueDirections[technique].de}${safetyDe}`,
        `${techniqueDirections[technique].en}${safetyEn}`,
      ),
      text(
        `Die Konsistenz abschließend einstellen, kräftig abschmecken und das Gericht heiß mit frischer Petersilie servieren.`,
        `Adjust the final consistency, season generously, and serve the dish hot with fresh parsley.`,
      ),
    ];
  }
  return [
    first,
    text(
      `Eine große Pfanne gleichmäßig erhitzen, Olivenöl zugeben und die Zutaten portionsweise anbraten.`,
      `Heat a large frying pan evenly, add olive oil, and brown the ingredients in batches.`,
    ),
    text(
      `${name(primary, "de")} zuerst bis zur passenden Bräunung garen, dann ${name(secondary, "de")} und die Aromaten ergänzen.`,
      `Cook the ${name(primary, "en")} to the appropriate colour first, then add the ${name(secondary, "en")} and aromatics.`,
    ),
    text(
      `${techniqueDirections[technique].de}${safetyDe}`,
      `${techniqueDirections[technique].en}${safetyEn}`,
    ),
    text(
      `Die Pfanne vom Herd nehmen, sorgfältig abschmecken und unmittelbar mit frischer Petersilie servieren.`,
      `Take the pan off the heat, season carefully, and serve immediately with fresh parsley.`,
    ),
  ];
}

for (const [method, concepts] of Object.entries(lunchConcepts)) {
  concepts.forEach(([slug, titleDe, titleEn, primary, secondary], index) => {
    const technique =
      lunchTechniques[method][index % lunchTechniques[method].length];
    const recipe = createRecipe({
      id: `lunch-${method}-${slug}`,
      titleDe,
      titleEn,
      ingredientLines: [
        conceptAmount(primary, 0),
        conceptAmount(secondary, 1),
        amount("onion", 1, "Stück", "piece"),
        amount("garlic", 2, "Zehen", "cloves"),
        amount("olive-oil", 2, "EL", "tbsp"),
        amount("vegetable-broth", 350, "ml", "ml"),
        amount("paprika-spice", 1, "TL", "tsp"),
        amount("parsley", 2, "EL", "tbsp"),
        amount("salt", 1, "Prise", "pinch"),
        amount("black-pepper", 1, "Prise", "pinch"),
      ],
      prep: 15 + (index % 6),
      cook: 20 + (index % 10),
      difficulty: difficultyFor(index + 21),
      cuisine: [
        "cuisine-european",
        "cuisine-mediterranean",
        "cuisine-asian",
        "cuisine-middle-eastern",
        "cuisine-modern",
      ][index % 5],
      method: `method-${method}`,
      meal: "meal-lunch",
      steps: lunchSteps(method, primary, secondary, technique),
    });
    recipe.baseRecipeId = `lunch-${method}-${slug}`;
    recipe.techniqueSignature = technique;
    recipe.visualKind = method;
    recipes.push(recipe);
  });
}

const familyMetadata = {
  bowl: {
    id: "base-bowl",
    title: text("Bowl-Grundrezept", "Build-your-own bowl"),
    technique: "cook-sear-assemble-bowl",
    visualKind: "bowl",
  },
  pasta: {
    id: "base-pasta",
    title: text("Pasta mit Tomatensauce", "Pasta with tomato sauce"),
    technique: "boil-saute-reduce-pasta",
    visualKind: "pasta",
  },
  curry: {
    id: "base-curry",
    title: text("Cremiges Curry mit Reis", "Creamy curry with rice"),
    technique: "toast-spices-simmer-curry",
    visualKind: "curry",
  },
  soup: {
    id: "base-soup",
    title: text("Kräftige Gemüsesuppe", "Hearty vegetable soup"),
    technique: "sweat-simmer-blend-soup",
    visualKind: "soup",
  },
  tray: {
    id: "base-tray",
    title: text("Ofengemüse vom Blech", "Sheet-pan roasted vegetables"),
    technique: "season-roast-turn-sheet-pan",
    visualKind: "oven",
  },
  salad: {
    id: "base-salad",
    title: text("Sättigender Salat", "Substantial mixed salad"),
    technique: "cook-cool-dress-salad",
    visualKind: "salad",
  },
  casserole: {
    id: "base-casserole",
    title: text("Herzhafter Auflauf", "Hearty casserole"),
    technique: "layer-bind-gratinate-casserole",
    visualKind: "casserole",
  },
  stew: {
    id: "base-stew",
    title: text("Herzhafter Eintopf", "Hearty stew"),
    technique: "brown-deglaze-braise-stew",
    visualKind: "stew",
  },
  cake: {
    id: "base-cake",
    title: text("Saftiger Rührkuchen", "Moist loaf cake"),
    technique: "cream-fold-bake-cake",
    visualKind: "cake",
  },
  muffin: {
    id: "base-muffin",
    title: text("Fruchtige Muffins", "Fruity muffins"),
    technique: "mix-fold-portion-bake-muffin",
    visualKind: "muffin",
  },
};

for (const recipe of recipes) {
  if (recipe.baseRecipeId) continue;
  const family = recipe.id.split("-")[0];
  const metadata = familyMetadata[family];
  if (!metadata) throw new Error(`Missing family metadata for ${recipe.id}`);
  recipe.baseRecipeId = metadata.id;
  recipe.techniqueSignature = metadata.technique;
  recipe.visualKind = metadata.visualKind;
  recipe.variationLabel = recipe.title;
  recipe.title = metadata.title;
}

const variationOptionsByBase = new Map();
for (const recipe of recipes) {
  if (!recipe.variationLabel) continue;
  const options = variationOptionsByBase.get(recipe.baseRecipeId) ?? [];
  if (
    !options.some((candidate) => candidate.de === recipe.variationLabel.de) &&
    options.length < 6
  ) {
    options.push(recipe.variationLabel);
  }
  variationOptionsByBase.set(recipe.baseRecipeId, options);
}
for (const recipe of recipes) {
  const options = variationOptionsByBase.get(recipe.baseRecipeId);
  if (options) {
    recipe.variationOptions = options.filter(
      (option) => option.de !== recipe.variationLabel?.de,
    );
  }
}

const catalog = {
  version: 3,
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
  `Generated ${recipes.length} bilingual variants across ${new Set(recipes.map(({ baseRecipeId }) => baseRecipeId)).size} base recipes at ${outputPath}`,
);
