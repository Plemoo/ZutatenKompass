import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { useI18n } from "../../i18n";
import { Typography } from "../../ui/Typography";
import { colors, radius, spacing } from "../../ui/theme";

const fallbackIcon = require("../../../assets/icon.png");

export function RecipeCard({
  id,
  title,
  onPress,
}: {
  id: string;
  title: string;
  onPress: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityHint={title}
      accessibilityRole="button"
      onPress={() => onPress(id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      testID={`recipe-card-${id}`}
    >
      <View style={styles.imageWrap}>
        <Image
          accessibilityLabel={t.common.fallbackImage}
          contentFit="contain"
          source={fallbackIcon}
          style={styles.image}
        />
      </View>
      <Typography kind="heading" numberOfLines={2} style={styles.title}>
        {title}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 92,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  imageWrap: {
    width: 88,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.saffronSoft,
  },
  image: { width: 58, height: 58 },
  title: { flex: 1, padding: spacing.lg },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
});
