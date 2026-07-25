import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "./theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
  testID?: string;
  footer?: ReactNode;
}>;

export function Screen({ children, scroll = true, testID, footer }: Props) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      testID={testID}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex]} testID={testID}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {content}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 96,
    gap: spacing.lg,
  },
  flex: { flex: 1 },
});
