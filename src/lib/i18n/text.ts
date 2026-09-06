/**
 * 本文を文単位に分割する。
 * 日本語・中国語は「。」、英語は「.」「!」「?」の直後で区切り、句点は前の文に残す。
 * 1 文ずつ改行して組むことで、余白の多い上質な組版にする。
 */
export function splitSentences(text: string): string[] {
  const matches = text.match(/[^。．！？.!?]+[。．！？.!?]*\s*/gu);
  if (!matches) return [text];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}
