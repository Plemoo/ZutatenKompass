import Storage from "expo-sqlite/kv-store";
import { useLocales } from "expo-localization";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { messages, type Locale, type Messages } from "./messages";

export type LocalePreference = Locale | "system";

type I18nValue = {
  locale: Locale;
  preference: LocalePreference;
  t: Messages;
  setPreference: (preference: LocalePreference) => void;
  ready: boolean;
};

const STORAGE_KEY = "zutatenkompass.locale";
const I18nContext = createContext<I18nValue | null>(null);

function supportedLocale(languageCode: string | null | undefined): Locale {
  return languageCode === "en" ? "en" : "de";
}

export function I18nProvider({ children }: PropsWithChildren) {
  const deviceLocales = useLocales();
  const [preference, setPreferenceState] = useState<LocalePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Storage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "de" || stored === "en" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setPreference = useCallback((next: LocalePreference) => {
    setPreferenceState(next);
    void Storage.setItem(STORAGE_KEY, next);
  }, []);

  const deviceLocale = supportedLocale(deviceLocales[0]?.languageCode);
  const locale = preference === "system" ? deviceLocale : preference;
  const value = useMemo(
    () => ({ locale, preference, t: messages[locale], setPreference, ready }),
    [locale, preference, ready, setPreference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
