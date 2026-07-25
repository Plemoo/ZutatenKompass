import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SelectedIngredient = { id: string; label: string };
export type SearchState = {
  include: SelectedIngredient[];
  exclude: SelectedIngredient[];
  facets: string[];
};

const initialState: SearchState = { include: [], exclude: [], facets: [] };

type SearchValue = SearchState & {
  addIngredient: (
    kind: "include" | "exclude",
    ingredient: SelectedIngredient,
  ) => boolean;
  removeIngredient: (kind: "include" | "exclude", id: string) => void;
  toggleFacet: (id: string) => void;
  reset: () => void;
};

const SearchContext = createContext<SearchValue | null>(null);

export function SearchProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(initialState);

  const addIngredient = useCallback(
    (kind: "include" | "exclude", ingredient: SelectedIngredient) => {
      if (
        state.include.some(({ id }) => id === ingredient.id) ||
        state.exclude.some(({ id }) => id === ingredient.id)
      ) {
        return false;
      }
      setState((current) => ({
        ...current,
        [kind]: [...current[kind], ingredient],
      }));
      return true;
    },
    [state.exclude, state.include],
  );

  const removeIngredient = useCallback(
    (kind: "include" | "exclude", id: string) => {
      setState((current) => ({
        ...current,
        [kind]: current[kind].filter((item) => item.id !== id),
      }));
    },
    [],
  );

  const toggleFacet = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      facets: current.facets.includes(id)
        ? current.facets.filter((facet) => facet !== id)
        : [...current.facets, id],
    }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);
  const value = useMemo(
    () => ({ ...state, addIngredient, removeIngredient, toggleFacet, reset }),
    [addIngredient, removeIngredient, reset, state, toggleFacet],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchState() {
  const value = useContext(SearchContext);
  if (!value)
    throw new Error("useSearchState must be used inside SearchProvider");
  return value;
}
