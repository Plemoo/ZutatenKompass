import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useI18n } from "../../i18n";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";

export type FacetViewOption = {
  id: string;
  label: string;
  parentId?: string;
};
export type FacetViewGroup = {
  id: string;
  label: string;
  options: readonly FacetViewOption[];
};

export function FacetFilters({
  groups,
  selected,
  onToggle,
  onReset,
}: {
  groups: readonly FacetViewGroup[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography kind="heading">{t.search.filters}</Typography>
        {selected.length > 0 && (
          <Pressable accessibilityRole="button" onPress={onReset}>
            <Typography style={styles.reset}>{t.common.reset}</Typography>
          </Pressable>
        )}
      </View>
      {groups.map((group) => {
        const isOpen = expanded === group.id;
        const activeCount = group.options.filter(({ id }) =>
          selected.includes(id),
        ).length;
        return (
          <View key={group.id} style={styles.group}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => setExpanded(isOpen ? null : group.id)}
              style={styles.groupButton}
            >
              <Typography style={styles.groupLabel}>{group.label}</Typography>
              {activeCount > 0 && (
                <View style={styles.count}>
                  <Typography kind="caption" style={styles.countLabel}>
                    {activeCount}
                  </Typography>
                </View>
              )}
              <MaterialCommunityIcons
                color={colors.ink}
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={22}
              />
            </Pressable>
            {isOpen && (
              <View style={styles.options}>
                {group.options.map((option) => {
                  const active = selected.includes(option.id);
                  return (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: active }}
                      key={option.id}
                      onPress={() => onToggle(option.id)}
                      style={[
                        styles.option,
                        option.parentId ? styles.childOption : undefined,
                        active && styles.optionActive,
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={active ? colors.leafDark : colors.muted}
                        name={
                          active
                            ? "checkbox-marked-circle"
                            : "checkbox-blank-circle-outline"
                        }
                        size={21}
                      />
                      <Typography style={active && styles.optionLabelActive}>
                        {option.label}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  reset: {
    minHeight: 40,
    color: colors.leafDark,
    fontWeight: "700",
    paddingTop: 8,
  },
  group: {
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.canvas,
  },
  groupButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  groupLabel: { flex: 1, fontWeight: "700" },
  count: {
    minWidth: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.leafSoft,
  },
  countLabel: { color: colors.leafDark, fontWeight: "800" },
  options: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  option: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  childOption: { marginLeft: spacing.lg },
  optionActive: { backgroundColor: colors.leafSoft },
  optionLabelActive: { color: colors.leafDark, fontWeight: "700" },
});
