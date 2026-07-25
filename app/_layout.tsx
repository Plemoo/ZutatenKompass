import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nProvider, useI18n } from "../src/i18n";
import { FavoritesProvider, SearchProvider } from "../src/state";
import { colors } from "../src/ui/theme";

function Navigation() {
  const { t } = useI18n();
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.leafDark,
          headerTitleStyle: { color: colors.ink, fontWeight: "700" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ title: t.search.results }} />
        <Stack.Screen name="recipe/[id]" options={{ title: "" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <FavoritesProvider>
        <SearchProvider>
          <Navigation />
        </SearchProvider>
      </FavoritesProvider>
    </I18nProvider>
  );
}
