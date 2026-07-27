import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import type { Recipe, RecipeVisualKind } from "../../domain";
import { useI18n } from "../../i18n";
import { colors, radius } from "../../ui/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
export interface RecipeIconPresentation {
  readonly kind: RecipeVisualKind;
  readonly icon: IconName;
  readonly badge: IconName;
  readonly backgroundColor: string;
  readonly foregroundColor: string;
  readonly accentColor: string;
}

const presentations: Record<
  RecipeVisualKind,
  Omit<RecipeIconPresentation, "kind" | "badge">
> = {
  cake: {
    icon: "cake-variant-outline",
    backgroundColor: colors.berrySoft,
    foregroundColor: colors.berry,
    accentColor: colors.berryAccent,
  },
  bowl: {
    icon: "bowl-mix",
    backgroundColor: colors.leafSoft,
    foregroundColor: colors.leafDark,
    accentColor: colors.leaf,
  },
  casserole: {
    icon: "toaster-oven",
    backgroundColor: colors.aubergineSoft,
    foregroundColor: colors.aubergine,
    accentColor: colors.aubergineAccent,
  },
  curry: {
    icon: "bowl-mix-outline",
    backgroundColor: colors.saffronSoft,
    foregroundColor: colors.copper,
    accentColor: colors.saffron,
  },
  muffin: {
    icon: "cupcake",
    backgroundColor: colors.berrySoft,
    foregroundColor: colors.berry,
    accentColor: colors.berryAccent,
  },
  oven: {
    icon: "toaster-oven",
    backgroundColor: colors.tomatoSoft,
    foregroundColor: colors.tomato,
    accentColor: colors.tomatoAccent,
  },
  pan: {
    icon: "stove",
    backgroundColor: colors.saffronSoft,
    foregroundColor: colors.copper,
    accentColor: colors.saffron,
  },
  pasta: {
    icon: "pasta",
    backgroundColor: colors.tomatoSoft,
    foregroundColor: colors.tomato,
    accentColor: colors.tomatoAccent,
  },
  pot: {
    icon: "pot-steam",
    backgroundColor: colors.copperSoft,
    foregroundColor: colors.copper,
    accentColor: colors.copperAccent,
  },
  salad: {
    icon: "leaf",
    backgroundColor: colors.leafSoft,
    foregroundColor: colors.leafDark,
    accentColor: colors.leaf,
  },
  soup: {
    icon: "pot-steam-outline",
    backgroundColor: colors.oceanSoft,
    foregroundColor: colors.ocean,
    accentColor: colors.oceanAccent,
  },
  stew: {
    icon: "pot-mix-outline",
    backgroundColor: colors.copperSoft,
    foregroundColor: colors.copper,
    accentColor: colors.copperAccent,
  },
  unknown: {
    icon: "food-variant",
    backgroundColor: colors.saffronSoft,
    foregroundColor: colors.copper,
    accentColor: colors.saffron,
  },
};

function kindFor(recipe: Recipe): RecipeVisualKind {
  if (recipe.visualKind && recipe.visualKind !== "unknown") {
    return recipe.visualKind;
  }
  const baseKind: Record<string, RecipeVisualKind> = {
    "base-bowl": "bowl",
    "base-cake": "cake",
    "base-casserole": "casserole",
    "base-curry": "curry",
    "base-muffin": "muffin",
    "base-pasta": "pasta",
    "base-salad": "salad",
    "base-soup": "soup",
    "base-stew": "stew",
    "base-tray": "oven",
  };
  const legacyBaseKind = baseKind[recipe.baseRecipeId];
  if (legacyBaseKind) return legacyBaseKind;

  const methodKinds: readonly [string, RecipeVisualKind][] = [
    ["method-baking", "cake"],
    ["method-casserole", "casserole"],
    ["method-oven", "oven"],
    ["method-pan", "pan"],
    ["method-pot", "pot"],
    ["method-stew", "pot"],
    ["method-salad", "salad"],
    ["method-bowl", "bowl"],
  ];
  return (
    methodKinds.find(([method]) =>
      recipe.facetOptionIds.includes(method),
    )?.[1] ?? "unknown"
  );
}

function badgeFor(recipe: Recipe): IconName {
  const ingredients = new Set(
    recipe.ingredients.map(({ ingredientId }) => ingredientId),
  );
  if (["salmon", "cod", "tuna", "shrimp"].some((id) => ingredients.has(id))) {
    return "fish";
  }
  if (["chicken", "turkey", "beef", "pork"].some((id) => ingredients.has(id))) {
    return "food-drumstick";
  }
  if (
    [
      "apple",
      "pear",
      "banana",
      "blueberry",
      "raspberry",
      "strawberry",
      "cherry",
      "orange",
    ].some((id) => ingredients.has(id))
  ) {
    return "food-apple";
  }
  if (
    ["cheddar", "gouda", "feta", "mozzarella", "parmesan"].some((id) =>
      ingredients.has(id),
    )
  ) {
    return "cheese";
  }
  if (["spaghetti", "penne", "pasta"].some((id) => ingredients.has(id))) {
    return "pasta";
  }
  if (
    ["rice", "basmati-rice", "brown-rice"].some((id) => ingredients.has(id))
  ) {
    return "rice";
  }
  return "sprout";
}

export function getRecipeIconPresentation(
  recipe: Recipe,
): RecipeIconPresentation {
  const kind = kindFor(recipe);
  return { kind, badge: badgeFor(recipe), ...presentations[kind] };
}

export function RecipeIcon({
  recipe,
  size = "card",
  accessible = true,
}: {
  recipe: Recipe;
  size?: "card" | "hero" | "mini";
  accessible?: boolean;
}) {
  const { t } = useI18n();
  const presentation = getRecipeIconPresentation(recipe);
  const hero = size === "hero";
  const mini = size === "mini";

  return (
    <View
      accessibilityLabel={t.recipeIcon[presentation.kind]}
      accessibilityRole="image"
      accessible={accessible}
      importantForAccessibility={accessible ? "yes" : "no"}
      style={[
        styles.container,
        hero
          ? styles.heroContainer
          : mini
            ? styles.miniContainer
            : styles.cardContainer,
        { backgroundColor: presentation.backgroundColor },
      ]}
      testID={`recipe-icon-${recipe.id}`}
    >
      <View
        style={[
          styles.ring,
          hero ? styles.heroRing : mini ? styles.miniRing : styles.cardRing,
          { borderColor: presentation.accentColor },
        ]}
      >
        <MaterialCommunityIcons
          color={presentation.foregroundColor}
          name={presentation.icon}
          size={hero ? 76 : mini ? 23 : 38}
        />
      </View>
      {!mini && (
        <View
          style={[
            styles.badge,
            hero ? styles.heroBadge : styles.cardBadge,
            { backgroundColor: presentation.foregroundColor },
          ]}
        >
          <MaterialCommunityIcons
            color={colors.surface}
            name={presentation.badge}
            size={hero ? 24 : 15}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
  },
  miniContainer: {
    width: 38,
    height: 38,
    borderRadius: 13,
  },
  heroContainer: {
    width: 152,
    height: 152,
    borderRadius: 48,
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: radius.pill,
  },
  cardRing: { width: 54, height: 54 },
  miniRing: { width: 30, height: 30, borderWidth: 1 },
  heroRing: { width: 122, height: 122, borderWidth: 3 },
  badge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: radius.pill,
  },
  cardBadge: { right: 2, bottom: 2, width: 25, height: 25 },
  heroBadge: { right: 5, bottom: 5, width: 40, height: 40 },
});
