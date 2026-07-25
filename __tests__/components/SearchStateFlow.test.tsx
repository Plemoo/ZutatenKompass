import { fireEvent, render } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";
import { SearchProvider, useSearchState } from "../../src/state/SearchProvider";

function Harness() {
  const search = useSearchState();
  return (
    <>
      <Pressable
        onPress={() =>
          search.addIngredient("include", { id: "cheese", label: "Käse" })
        }
      >
        <Text>Add include</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          search.addIngredient("exclude", { id: "cheese", label: "Käse" })
        }
      >
        <Text>Add conflicting exclude</Text>
      </Pressable>
      <Text testID="include-count">{search.include.length}</Text>
      <Text testID="exclude-count">{search.exclude.length}</Text>
    </>
  );
}

describe("SearchProvider flow", () => {
  it("prevents the same ingredient from being included and excluded", async () => {
    const view = await render(
      <SearchProvider>
        <Harness />
      </SearchProvider>,
    );
    await fireEvent.press(view.getByText("Add include"));
    await fireEvent.press(view.getByText("Add conflicting exclude"));
    expect(view.getByTestId("include-count").props.children).toBe(1);
    expect(view.getByTestId("exclude-count").props.children).toBe(0);
  });
});
