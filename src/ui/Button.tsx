import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

type Props = ComponentProps<typeof Pressable> & {
  label: string;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  label,
  variant = "primary",
  disabled,
  style,
  ...props
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Typography
        style={[styles.label, variant !== "primary" && styles.secondaryLabel]}
      >
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  primary: { backgroundColor: colors.leafDark },
  secondary: {
    backgroundColor: colors.leafSoft,
    borderWidth: 1,
    borderColor: colors.leaf,
  },
  danger: {
    backgroundColor: colors.tomatoSoft,
    borderWidth: 1,
    borderColor: colors.tomato,
  },
  label: { color: colors.surface, fontWeight: "700" },
  secondaryLabel: { color: colors.ink },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.42 },
});
