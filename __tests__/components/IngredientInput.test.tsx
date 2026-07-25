import { fireEvent, render } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";
import { IngredientInput } from "../../src/features/search/IngredientInput";
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

describe("IngredientInput", () => {
  it("adds a resolved alias on submit and clears the input", async () => {
    const onAdd = jest.fn();
    const view = await render(
      <IngredientInput
        kind="include"
        onAdd={onAdd}
        onRemove={jest.fn()}
        oppositeValue={[]}
        suggest={() => [{ id: "cheddar", label: "Cheddar", resolved: true }]}
        value={[]}
      />,
      { wrapper: Wrapper },
    );

    const input = view.getByTestId("ingredient-input-include");
    await fireEvent.changeText(input, "cheddar käse");
    await fireEvent(input, "submitEditing", {
      nativeEvent: { text: "cheddar käse" },
    });
    await fireEvent(input, "blur");

    expect(onAdd).toHaveBeenCalledWith({
      id: "cheddar",
      label: "Cheddar",
    });
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(input.props.value).toBe("");
  });

  it("shows suggestions without silently accepting an uncertain ingredient", async () => {
    const onAdd = jest.fn();
    const view = await render(
      <IngredientInput
        kind="exclude"
        onAdd={onAdd}
        onRemove={jest.fn()}
        oppositeValue={[]}
        suggest={() => [{ id: "tomato", label: "Tomate" }]}
        value={[]}
      />,
      { wrapper: Wrapper },
    );

    const input = view.getByTestId("ingredient-input-exclude");
    await fireEvent.changeText(input, "tomatte");
    await fireEvent(input, "submitEditing", {
      nativeEvent: { text: "tomatte" },
    });

    expect(view.getByText("Meintest du …?")).toBeTruthy();
    expect(onAdd).not.toHaveBeenCalled();
    await fireEvent.press(view.getByText("Tomate"));
    expect(onAdd).toHaveBeenCalledWith({ id: "tomato", label: "Tomate" });
  });
});
