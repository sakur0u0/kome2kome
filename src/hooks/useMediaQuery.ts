"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * CSS メディアクエリの真偽を購読する。SSR 時は fallback を返す。
 * 縦書き ↔ 横組み の切り替えなど、DOM 構造そのものを変える判定に使う。
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
