import type { EmojiData, EmojiDataEmoji, EmojiPickerData, SkinTone } from "./types";

export function searchEmojis(emojis: EmojiDataEmoji[], search = "") {
  const query = search.toLocaleLowerCase().trim();
  if (!query) return emojis;

  return emojis
    .map((emoji) => ({
      emoji,
      score:
        (emoji.label.toLocaleLowerCase().includes(query) ? 10 : 0) +
        emoji.tags.reduce((score, tag) => score + Number(tag.toLocaleLowerCase().includes(query)), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ emoji }) => emoji);
}

export function getEmojiPickerData(data: EmojiData, columns: number, skinTone: SkinTone, search: string): EmojiPickerData {
  const rows: EmojiPickerData["rows"] = [];
  const categories: EmojiPickerData["categories"] = [];
  const categoriesStartRowIndices: number[] = [];
  const byCategory = new Map<number, EmojiDataEmoji[]>();

  for (const emoji of searchEmojis(data.emojis, search)) {
    const collection = byCategory.get(emoji.category) ?? [];
    collection.push(emoji);
    byCategory.set(emoji.category, collection);
  }

  let categoryIndex = 0;
  let startRowIndex = 0;
  for (const category of data.categories) {
    const emojis = byCategory.get(category.index);
    if (!emojis?.length) continue;

    const categoryRows = Array.from({ length: Math.ceil(emojis.length / columns) }, (_, index) => ({
      categoryIndex,
      emojis: emojis.slice(index * columns, (index + 1) * columns).map((emoji) => ({
        emoji: skinTone !== "none" ? emoji.skins?.[skinTone] ?? emoji.emoji : emoji.emoji,
        label: emoji.label,
      })),
    }));

    rows.push(...categoryRows);
    categories.push({ label: category.label, rowsCount: categoryRows.length, startRowIndex });
    categoriesStartRowIndices.push(startRowIndex);
    startRowIndex += categoryRows.length;
    categoryIndex += 1;
  }

  return { count: byCategory.size ? searchEmojis(data.emojis, search).length : 0, categories, categoriesStartRowIndices, rows, skinTones: data.skinTones };
}
