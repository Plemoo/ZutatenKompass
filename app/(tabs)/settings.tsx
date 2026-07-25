import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useI18n, type LocalePreference } from "../../src/i18n";
import { Screen } from "../../src/ui/Screen";
import { Typography } from "../../src/ui/Typography";
import { colors, radius, spacing } from "../../src/ui/theme";

export default function SettingsScreen() {
  const { preference, setPreference, t } = useI18n();
  const choices: { id: LocalePreference; label: string; flag: string }[] = [
    { id: "system", label: t.settings.system, flag: "🌐" },
    { id: "de", label: t.settings.german, flag: "🇩🇪" },
    { id: "en", label: t.settings.english, flag: "🇬🇧" },
  ];

  return (
    <Screen testID="settings-screen">
      <Typography kind="display">{t.settings.title}</Typography>
      <View style={styles.section}>
        <Typography kind="heading">{t.settings.language}</Typography>
        <Typography kind="caption">{t.settings.languageHint}</Typography>
        <View accessibilityRole="radiogroup" style={styles.choices}>
          {choices.map((choice) => {
            const active = preference === choice.id;
            return (
              <Pressable
                accessibilityLabel={choice.label}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                key={choice.id}
                onPress={() => setPreference(choice.id)}
                style={[styles.choice, active && styles.choiceActive]}
                testID={`language-${choice.id}`}
              >
                <Typography
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                  style={styles.flag}
                >
                  {choice.flag}
                </Typography>
                <MaterialCommunityIcons
                  color={active ? colors.leafDark : colors.muted}
                  name={active ? "radiobox-marked" : "radiobox-blank"}
                  size={23}
                />
                <Typography style={active && styles.choiceLabelActive}>
                  {choice.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>
      <InfoCard
        body={t.settings.offlineBody}
        icon="cloud-off-outline"
        title={t.settings.offlineTitle}
      />
      <InfoCard
        body={t.settings.privacyBody}
        icon="shield-check-outline"
        title={t.settings.privacyTitle}
      />
    </Screen>
  );
}

function InfoCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: "cloud-off-outline" | "shield-check-outline";
}) {
  return (
    <View style={styles.info}>
      <MaterialCommunityIcons color={colors.leaf} name={icon} size={31} />
      <View style={styles.infoText}>
        <Typography kind="heading">{title}</Typography>
        <Typography kind="caption">{body}</Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  choices: { gap: spacing.sm },
  choice: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.canvas,
  },
  choiceActive: { backgroundColor: colors.leafSoft },
  choiceLabelActive: { color: colors.leafDark, fontWeight: "700" },
  flag: { fontSize: 26 },
  info: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.saffronSoft,
  },
  infoText: { flex: 1, gap: spacing.xs },
});
