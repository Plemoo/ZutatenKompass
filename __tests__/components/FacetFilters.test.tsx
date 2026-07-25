import { fireEvent, render } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";
import { FacetFilters } from "../../src/features/search/FacetFilters";
import { I18nProvider } from "../../src/i18n";

jest.mock("expo-localization", () => ({
  useLocales: () => [{ languageCode: "de" }],
}));

jest.mock("expo-sqlite/kv-store", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
  },
}));

function Wrapper({ children }: PropsWithChildren) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe("FacetFilters", () => {
  it("expands a group and emits a nested option selection", async () => {
    const onToggle = jest.fn();
    const view = await render(
      <FacetFilters
        groups={[
          {
            id: "diet",
            label: "Ernährung",
            options: [
              { id: "vegetarian", label: "Vegetarisch" },
              { id: "vegan", label: "Vegan", parentId: "vegetarian" },
            ],
          },
        ]}
        onReset={jest.fn()}
        onToggle={onToggle}
        selected={[]}
      />,
      { wrapper: Wrapper },
    );

    await fireEvent.press(view.getByText("Ernährung"));
    await fireEvent.press(view.getByText("Vegan"));
    expect(onToggle).toHaveBeenCalledWith("vegan");
  });
});
