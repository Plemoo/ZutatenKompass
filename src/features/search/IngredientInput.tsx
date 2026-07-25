import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
} from "react-native";
import { useI18n, type Locale } from "../../i18n";
import type { SelectedIngredient } from "../../state";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";

export type IngredientCandidate = SelectedIngredient & { resolved?: boolean };

type Props = {
  kind: "include" | "exclude";
  value: readonly SelectedIngredient[];
  oppositeValue: readonly SelectedIngredient[];
  onAdd: (ingredient: SelectedIngredient) => void;
  onRemove: (id: string) => void;
  suggest: (query: string, locale: Locale) => readonly IngredientCandidate[];
};

export function IngredientInput({
  kind,
  value,
  oppositeValue,
  onAdd,
  onRemove,
  suggest,
}: Props) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<readonly IngredientCandidate[]>(
    [],
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const committedQuery = useRef<string | null>(null);

  const validate = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setCandidates([]);
      setFeedback(null);
      return;
    }
    if (committedQuery.current === trimmed) return;
    const next = suggest(trimmed, locale).slice(0, 3);
    const exact = next.find(
      ({ label, resolved }) =>
        resolved ||
        label.localeCompare(trimmed, locale, { sensitivity: "base" }) === 0,
    );
    if (exact) {
      if (value.some(({ id }) => id === exact.id)) {
        setFeedback(t.search.duplicate);
      } else if (oppositeValue.some(({ id }) => id === exact.id)) {
        setFeedback(t.search.conflict);
      } else {
        committedQuery.current = trimmed;
        onAdd({ id: exact.id, label: exact.label });
        setQuery("");
        setFeedback(null);
      }
      setCandidates([]);
      return;
    }
    setCandidates(next);
    setFeedback(next.length ? null : t.search.unknown);
  }, [locale, onAdd, oppositeValue, query, suggest, t.search, value]);

  const submit = useCallback(
    (_event?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) =>
      validate(),
    [validate],
  );

  const choose = (candidate: IngredientCandidate) => {
    if (oppositeValue.some(({ id }) => id === candidate.id)) {
      setFeedback(t.search.conflict);
      return;
    }
    if (value.some(({ id }) => id === candidate.id)) {
      setFeedback(t.search.duplicate);
      return;
    }
    onAdd(candidate);
    setQuery("");
    setCandidates([]);
    setFeedback(null);
  };

  const title = kind === "include" ? t.search.include : t.search.exclude;
  const hint = kind === "include" ? t.search.includeHint : t.search.excludeHint;
  const accent = kind === "include" ? colors.leaf : colors.tomato;

  return (
    <View style={styles.section}>
      <Typography kind="heading">{title}</Typography>
      {value.length > 0 && (
        <View accessibilityRole="list" style={styles.chips}>
          {value.map((item) => (
            <View
              key={item.id}
              style={[styles.chip, kind === "exclude" && styles.excludeChip]}
            >
              <Typography style={styles.chipLabel}>{item.label}</Typography>
              <Pressable
                accessibilityLabel={`${item.label}: ${t.common.remove}`}
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => onRemove(item.id)}
              >
                <MaterialCommunityIcons
                  color={colors.ink}
                  name="close"
                  size={18}
                />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <View style={[styles.inputRow, { borderColor: accent }]}>
        <TextInput
          accessibilityLabel={title}
          autoCapitalize="none"
          enterKeyHint="done"
          onBlur={validate}
          onChangeText={(text) => {
            committedQuery.current = null;
            setQuery(text);
            setCandidates([]);
            setFeedback(null);
          }}
          onSubmitEditing={submit}
          placeholder={hint}
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          style={styles.input}
          testID={`ingredient-input-${kind}`}
          value={query}
        />
        <Pressable
          accessibilityLabel={t.search.add}
          accessibilityRole="button"
          disabled={!query.trim()}
          onPress={validate}
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}
          testID={`ingredient-add-${kind}`}
        >
          <MaterialCommunityIcons color={accent} name="plus-circle" size={28} />
        </Pressable>
      </View>
      {candidates.length > 0 && (
        <View accessibilityLiveRegion="polite" style={styles.suggestions}>
          <Typography kind="caption">{t.search.suggestion}</Typography>
          {candidates.map((candidate) => (
            <Pressable
              accessibilityRole="button"
              key={candidate.id}
              onPress={() => choose(candidate)}
              style={({ pressed }) => [
                styles.suggestion,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color={colors.leaf}
                name="arrow-right"
                size={18}
              />
              <Typography style={styles.suggestionLabel}>
                {candidate.label}
              </Typography>
            </Pressable>
          ))}
        </View>
      )}
      {!!feedback && (
        <Typography
          accessibilityLiveRegion="polite"
          kind="caption"
          style={styles.feedback}
        >
          {feedback}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.leafSoft,
  },
  chipLabel: { fontWeight: "600" },
  excludeChip: { backgroundColor: colors.tomatoSoft },
  inputRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    minHeight: 52,
    flex: 1,
    paddingHorizontal: spacing.lg,
    color: colors.ink,
    fontSize: 16,
  },
  add: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestions: {
    overflow: "hidden",
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.saffronSoft,
  },
  suggestion: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  suggestionLabel: { flex: 1, fontWeight: "700" },
  feedback: { color: colors.danger },
  pressed: { opacity: 0.6 },
});
