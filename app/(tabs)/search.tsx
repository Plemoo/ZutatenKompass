import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SearchEditor } from "../../src/features/search/SearchEditor";
import { useI18n } from "../../src/i18n";
import { useSearchState } from "../../src/state";
import { Button } from "../../src/ui/Button";
import { Screen } from "../../src/ui/Screen";
import { Typography } from "../../src/ui/Typography";
import { colors, radius, spacing } from "../../src/ui/theme";

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const search = useSearchState();

  return (
    <Screen testID="search-screen">
      <View style={styles.hero}>
        <Typography kind="caption" style={styles.eyebrow}>
          {t.search.eyebrow.toUpperCase()}
        </Typography>
        <Typography kind="display">{t.search.title}</Typography>
        <Typography style={styles.intro}>{t.search.intro}</Typography>
      </View>
      <SearchEditor />
      <Button
        disabled={search.include.length === 0}
        label={t.search.submit}
        onPress={() => router.push("/results")}
        testID="find-recipes"
      />
      {search.include.length === 0 && (
        <Typography kind="caption" style={styles.center}>
          {t.search.noIngredientsBody}
        </Typography>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.saffronSoft,
  },
  eyebrow: { color: colors.tomato, fontWeight: "800", letterSpacing: 1.2 },
  intro: { color: colors.muted },
  center: { textAlign: "center" },
});
