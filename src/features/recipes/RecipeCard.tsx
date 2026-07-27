import { Pressable, StyleSheet, View } from "react-native";
import type { Recipe } from "../../domain";
import { useI18n } from "../../i18n";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";
import { getRecipeIconPresentation, RecipeIcon } from "./RecipeIcon";

export function RecipeCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: (id: string) => void;
}) {
  const { locale, t } = useI18n();
  const title = recipe.title[locale];
  const presentation = getRecipeIconPresentation(recipe);
  return (
    <Pressable
      accessibilityHint={t.common.openRecipe}
      accessibilityLabel={`${title}, ${t.recipeIcon[presentation.kind]}`}
      accessibilityRole="button"
      onPress={() => onPress(recipe.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      testID={`recipe-card-${recipe.id}`}
    >
      <View style={styles.imageWrap}>
        <RecipeIcon accessible={false} recipe={recipe} />
      </View>
      <Typography kind="heading" numberOfLines={2} style={styles.title}>
        {title}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 92,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  imageWrap: {
    width: 92,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
  },
  title: { flex: 1, padding: spacing.lg },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
});
