import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Share, Pressable, StyleSheet, View } from "react-native";
import type { Recipe, RecipeMatch } from "../../domain";
import { useI18n } from "../../i18n";
import { useFavorites } from "../../state";
import { Button } from "../../ui/Button";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";
import { facetLabel, ingredientLabel } from "./domainAdapter";
import { RecipeIcon } from "./RecipeIcon";

export function RecipeDetail({
  recipe,
  match,
  compact = false,
}: {
  recipe: Recipe;
  match?: RecipeMatch;
  compact?: boolean;
}) {
  const { locale, t } = useI18n();
  const favorites = useFavorites();
  const favorite = favorites.isFavorite(recipe.id);
  const highlightedIds = new Set(
    match?.highlights.ingredients.flatMap(({ matchedRecipeIngredientIds }) => [
      ...matchedRecipeIngredientIds,
    ]) ?? [],
  );
  const facetHighlights = match?.highlights.facetOptionIds ?? [];
  const url = `zutatenkompass://recipe/${encodeURIComponent(recipe.id)}`;

  const share = () =>
    Share.share({
      title: recipe.title[locale],
      message: t.detail.shareMessage(recipe.title[locale], url),
      url,
    });

  return (
    <View style={styles.container}>
      {!compact && (
        <>
          <View style={styles.hero}>
            <RecipeIcon recipe={recipe} size="hero" />
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel={
                favorite ? t.detail.favoriteRemove : t.detail.favoriteAdd
              }
              accessibilityRole="button"
              accessibilityState={{ selected: favorite }}
              onPress={() => favorites.toggle(recipe.id)}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons
                color={favorite ? colors.tomato : colors.leafDark}
                name={favorite ? "heart" : "heart-outline"}
                size={27}
              />
            </Pressable>
            <Button
              label={t.detail.share}
              onPress={share}
              style={styles.shareButton}
            />
          </View>
        </>
      )}
      {facetHighlights.length > 0 && (
        <View accessibilityRole="summary" style={styles.facets}>
          <Typography kind="caption" style={styles.facetsTitle}>
            ✓ {t.detail.facetMatch}
          </Typography>
          <View style={styles.facetRow}>
            {facetHighlights.map((id) => (
              <View key={id} style={styles.facetChip}>
                <Typography kind="caption" style={styles.facetText}>
                  {facetLabel(id, locale)}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      )}
      {recipe.variationLabel && (
        <View style={styles.variationMatch}>
          <Typography kind="caption" style={styles.variationMatchTitle}>
            {t.detail.selectedVariation}
          </Typography>
          <Typography>{recipe.variationLabel[locale]}</Typography>
        </View>
      )}
      <View style={styles.section}>
        <Typography kind="heading">{t.detail.ingredients}</Typography>
        {recipe.ingredients.map((ingredient) => {
          const highlighted = highlightedIds.has(ingredient.ingredientId);
          return (
            <View
              key={`${ingredient.ingredientId}-${ingredient.amount}`}
              style={[styles.ingredient, highlighted && styles.highlight]}
            >
              <MaterialCommunityIcons
                color={highlighted ? colors.leafDark : colors.saffron}
                name={highlighted ? "check-circle" : "circle-small"}
                size={highlighted ? 21 : 24}
              />
              <Typography style={styles.ingredientName}>
                {ingredientLabel(ingredient.ingredientId, locale)}
                {highlighted ? ` · ${t.detail.matched}` : ""}
              </Typography>
              <Typography kind="caption">
                {ingredient.amount} {ingredient.unit[locale]}
              </Typography>
            </View>
          );
        })}
      </View>
      <View style={styles.section}>
        <Typography kind="heading">{t.detail.steps}</Typography>
        {recipe.steps.map((step, index) => (
          <View key={`${recipe.id}-step-${index}`} style={styles.step}>
            <View style={styles.stepNumber}>
              <Typography style={styles.stepNumberText}>{index + 1}</Typography>
            </View>
            <Typography style={styles.stepText}>{step[locale]}</Typography>
          </View>
        ))}
      </View>
      {recipe.variationOptions && recipe.variationOptions.length > 0 && (
        <View style={styles.section}>
          <Typography kind="heading">{t.detail.variations}</Typography>
          {recipe.variationOptions.map((variation) => (
            <View key={variation[locale]} style={styles.variationOption}>
              <MaterialCommunityIcons
                color={colors.leaf}
                name="swap-horizontal"
                size={22}
              />
              <Typography style={styles.stepText}>
                {variation[locale]}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  hero: {
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.saffronSoft,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconButton: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  shareButton: { flex: 1 },
  facets: { gap: spacing.sm },
  facetsTitle: { color: colors.leafDark, fontWeight: "700" },
  facetRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  facetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.leafSoft,
  },
  facetText: { color: colors.leafDark, fontWeight: "700" },
  variationMatch: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.leafSoft,
  },
  variationMatchTitle: { color: colors.leafDark, fontWeight: "700" },
  section: { gap: spacing.md },
  ingredient: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  highlight: {
    borderWidth: 1,
    borderColor: colors.leaf,
    backgroundColor: colors.leafSoft,
  },
  ingredientName: { flex: 1 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  stepNumber: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.tomatoSoft,
  },
  stepNumberText: { color: colors.tomato, fontWeight: "800" },
  stepText: { flex: 1 },
  variationOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
});
