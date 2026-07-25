import { StyleSheet, View } from "react-native";
import { useI18n } from "../../i18n";
import { useSearchState } from "../../state";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";
import {
  facetGroups,
  ingredientLabel,
  suggestIngredientCandidates,
} from "../recipes/domainAdapter";
import { FacetFilters } from "./FacetFilters";
import { IngredientInput } from "./IngredientInput";

export function SearchEditor() {
  const { locale, t } = useI18n();
  const search = useSearchState();
  const localizedInclude = search.include.map(({ id }) => ({
    id,
    label: ingredientLabel(id, locale),
  }));
  const localizedExclude = search.exclude.map(({ id }) => ({
    id,
    label: ingredientLabel(id, locale),
  }));

  return (
    <View style={styles.container}>
      <IngredientInput
        kind="include"
        onAdd={(ingredient) => search.addIngredient("include", ingredient)}
        onRemove={(id) => search.removeIngredient("include", id)}
        oppositeValue={localizedExclude}
        suggest={suggestIngredientCandidates}
        value={localizedInclude}
      />
      <IngredientInput
        kind="exclude"
        onAdd={(ingredient) => search.addIngredient("exclude", ingredient)}
        onRemove={(id) => search.removeIngredient("exclude", id)}
        oppositeValue={localizedInclude}
        suggest={suggestIngredientCandidates}
        value={localizedExclude}
      />
      <FacetFilters
        groups={facetGroups(locale)}
        onReset={() => search.facets.forEach(search.toggleFacet)}
        onToggle={search.toggleFacet}
        selected={search.facets}
      />
      <View style={styles.offline}>
        <Typography kind="caption" style={styles.offlineText}>
          ✓ {t.search.offline}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  offline: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.leafSoft,
  },
  offlineText: { color: colors.leafDark, fontWeight: "600" },
});
