import Storage from "expo-sqlite/kv-store";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "zutatenkompass.favoriteRecipeIds.v1";

type FavoritesValue = {
  ids: string[];
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Storage.getItem(STORAGE_KEY)
      .then((raw) => setIds(parseIds(raw)))
      .finally(() => setReady(true));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id)
        ? current.filter((candidate) => candidate !== id)
        : [id, ...current];
      void Storage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ids,
      ready,
      isFavorite: (id: string) => ids.includes(id),
      toggle,
    }),
    [ids, ready, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value)
    throw new Error("useFavorites must be used inside FavoritesProvider");
  return value;
}
