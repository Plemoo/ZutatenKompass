import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SettingsScreen from "../../app/(tabs)/settings";
import { I18nProvider } from "../../src/i18n";

jest.mock("expo-localization", () => ({
  useLocales: () => [{ languageCode: "en" }],
}));

jest.mock("expo-sqlite/kv-store", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
  },
}));

describe("Settings language selection", () => {
  it("shows flag choices and switches the complete UI to German", async () => {
    const view = await render(
      <I18nProvider>
        <SettingsScreen />
      </I18nProvider>,
    );

    const renderedSettings = JSON.stringify(view.toJSON());
    expect(renderedSettings).toContain("🇩🇪");
    expect(renderedSettings).toContain("🇬🇧");
    expect(view.getByText("Settings")).toBeTruthy();

    fireEvent.press(view.getByTestId("language-de"));

    await waitFor(() => {
      expect(view.getByText("Einstellungen")).toBeTruthy();
      expect(view.getByTestId("language-de").props.accessibilityState).toEqual({
        checked: true,
      });
    });
  });
});
