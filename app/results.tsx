import { useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { RecipeCard } from "../src/features/recipes/RecipeCard";
import { findRecipes } from "../src/features/recipes/domainAdapter";
import { SearchEditor } from "../src/features/search/SearchEditor";
import { useI18n } from "../src/i18n";
import { useSearchState } from "../src/state";
import { EmptyState } from "../src/ui/EmptyState";
import { Screen } from "../src/ui/Screen";
import { Typography } from "../src/ui/Typography";
import { spacing } from "../src/ui/theme";

export default function ResultsScreen() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const search = useSearchState();
  const matches =
    search.include.length === 0
      ? []
      : findRecipes(
          search.include.map(({ id }) => id),
          search.exclude.map(({ id }) => id),
          search.facets,
          locale,
        );

  return (
    <Screen scroll={false} testID="results-screen">
      <FlatList
        contentContainerStyle={styles.content}
        data={matches}
        initialNumToRender={10}
        keyboardShouldPersistTaps="handled"
        keyExtractor={({ recipe }) => recipe.id}
        ListEmptyComponent={
          <EmptyState
            icon="pot-steam-outline"
            message={
              search.include.length
                ? t.search.noResultsBody
                : t.search.noIngredientsBody
            }
            title={
              search.include.length
                ? t.search.noResults
                : t.search.noIngredients
            }
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <SearchEditor />
            <View accessibilityLiveRegion="polite" style={styles.header}>
              <Typography kind="title">{t.search.results}</Typography>
              <Typography kind="caption">
                {t.search.resultCount(matches.length)}
              </Typography>
            </View>
          </View>
        }
        renderItem={({ item: { recipe } }) => (
          <RecipeCard
            id={recipe.id}
            onPress={(id) =>
              router.push({ pathname: "/recipe/[id]", params: { id } })
            }
            title={recipe.title[locale]}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 96, gap: spacing.md },
  headerContent: { gap: spacing.lg, marginBottom: spacing.sm },
  header: { gap: spacing.xs },
});
