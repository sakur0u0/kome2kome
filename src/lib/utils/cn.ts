/** クラス名を条件付きで結合する小さなユーティリティ */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
