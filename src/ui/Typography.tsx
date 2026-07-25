import type { PropsWithChildren } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";
import { colors } from "./theme";

type Kind = "display" | "title" | "heading" | "body" | "caption";

export function Typography({
  kind = "body",
  style,
  children,
  ...props
}: PropsWithChildren<TextProps & { kind?: Kind }>) {
  return (
    <Text {...props} style={[styles.base, styles[kind], style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: colors.ink },
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  heading: { fontSize: 19, lineHeight: 24, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 23 },
  caption: { fontSize: 14, lineHeight: 19, color: colors.muted },
});
