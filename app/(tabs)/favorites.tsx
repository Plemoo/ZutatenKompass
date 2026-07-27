import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { RecipeDetail } from "../../src/features/recipes/RecipeDetail";
import { RecipeIcon } from "../../src/features/recipes/RecipeIcon";
import { getRecipe } from "../../src/features/recipes/domainAdapter";
import { useI18n } from "../../src/i18n";
import { useFavorites } from "../../src/state";
import { EmptyState } from "../../src/ui/EmptyState";
import { Screen } from "../../src/ui/Screen";
import { Typography } from "../../src/ui/Typography";
import { colors, radius, spacing } from "../../src/ui/theme";

export default function FavoritesScreen() {
  const { locale, t } = useI18n();
  const favorites = useFavorites();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Screen testID="favorites-screen">
      <View style={styles.header}>
        <Typography kind="display">{t.favorites.title}</Typography>
        <Typography>{t.favorites.intro}</Typography>
      </View>
      {!favorites.ready ? (
        <View
          accessibilityLabel={t.common.loading}
          accessibilityRole="progressbar"
        >
          <ActivityIndicator color={colors.leaf} size="large" />
        </View>
      ) : favorites.ids.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          message={t.favorites.emptyBody}
          title={t.favorites.empty}
        />
      ) : (
        <View style={styles.list}>
          {favorites.ids.map((id) => {
            const recipe = getRecipe(id);
            const open = id === expandedId;
            return (
              <View key={id} style={styles.item}>
                <Pressable
                  accessibilityLabel={
                    recipe?.title[locale] ?? t.favorites.missing
                  }
                  accessibilityHint={
                    open ? t.favorites.collapse : t.favorites.expand
                  }
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  onPress={() => setExpandedId(open ? null : id)}
                  style={styles.itemHeader}
                >
                  {recipe ? (
                    <RecipeIcon
                      accessible={false}
                      recipe={recipe}
                      size="mini"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      color={colors.tomato}
                      name="heart"
                      size={22}
                    />
                  )}
                  <Typography kind="heading" style={styles.itemTitle}>
                    {recipe?.title[locale] ?? t.favorites.missing}
                  </Typography>
                  <MaterialCommunityIcons
                    color={colors.ink}
                    name={open ? "chevron-up" : "chevron-down"}
                    size={24}
                  />
                </Pressable>
                {open && recipe && (
                  <View style={styles.expanded}>
                    <RecipeDetail compact recipe={recipe} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm },
  list: { gap: spacing.md },
  item: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  itemHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  itemTitle: { flex: 1 },
  expanded: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.canvas,
  },
});
