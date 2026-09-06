import { detectLocale } from "./locales";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";

/**
 * ロケールを保持する軽量な外部ストア。
 * React 側は useSyncExternalStore で購読する。
 *
 * - サーバー描画時は常に DEFAULT_LOCALE を返し、ハイドレーション後に
 *   localStorage → ブラウザ言語 の優先順で実際のロケールへ切り替える。
 *   （useEffect 内で setState する必要がなく、ハイドレーション不一致も起きない）
 */
export const LOCALE_STORAGE_KEY = "kome2kome.locale";

type Listener = () => void;

let current: Locale | null = null;
const listeners = new Set<Listener>();

function readInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* プライベートモード等で localStorage が使えない場合は無視 */
  }
  return detectLocale(navigator.languages ?? [navigator.language]);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export const localeStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): Locale {
    if (current === null) current = readInitialLocale();
    return current;
  },

  getServerSnapshot(): Locale {
    return DEFAULT_LOCALE;
  },

  set(locale: Locale) {
    if (current === locale) return;
    current = locale;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* 保存できなくても表示は切り替える */
    }
    emit();
  },
};
