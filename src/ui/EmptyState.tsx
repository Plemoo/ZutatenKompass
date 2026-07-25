import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

export function EmptyState({
  title,
  message,
  icon = "food-apple-outline",
}: {
  title: string;
  message: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
}) {
  return (
    <View accessibilityRole="summary" style={styles.box}>
      <MaterialCommunityIcons color={colors.leaf} name={icon} size={40} />
      <Typography kind="heading">{title}</Typography>
      <Typography kind="caption" style={styles.center}>
        {message}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.leafSoft,
  },
  center: { textAlign: "center" },
});
