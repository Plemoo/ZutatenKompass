import { Stack, useLocalSearchParams } from "expo-router";
import { RecipeDetail } from "../../src/features/recipes/RecipeDetail";
import {
  findRecipes,
  getRecipe,
} from "../../src/features/recipes/domainAdapter";
import { useI18n } from "../../src/i18n";
import { useSearchState } from "../../src/state";
import { EmptyState } from "../../src/ui/EmptyState";
import { Screen } from "../../src/ui/Screen";

export default function RecipeScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { locale, t } = useI18n();
  const search = useSearchState();
  const id = typeof params.id === "string" ? params.id : "";
  const recipe = getRecipe(id);
  const match = recipe
    ? findRecipes(
        search.include.map(({ id: ingredientId }) => ingredientId),
        search.exclude.map(({ id: ingredientId }) => ingredientId),
        search.facets,
        locale,
      ).find(({ recipe: candidate }) => candidate.id === recipe.id)
    : undefined;

  if (!recipe) {
    return (
      <Screen testID="invalid-recipe-screen">
        <Stack.Screen options={{ title: t.detail.invalid }} />
        <EmptyState
          icon="link-variant-off"
          message={t.detail.invalidBody}
          title={t.detail.invalid}
        />
      </Screen>
    );
  }

  return (
    <Screen testID="recipe-detail-screen">
      <Stack.Screen options={{ title: recipe.title[locale] }} />
      <RecipeDetail {...(match ? { match } : {})} recipe={recipe} />
    </Screen>
  );
}
