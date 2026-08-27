import type {
  CustomEmoji,
  Emoji,
  EmojiData,
  EmojiDataEmoji,
  EmojiPickerData,
  SkinTone,
} from "./types";

function normalizeQuery(value: string) {
  return value.toLocaleLowerCase().trim().replace(/^:|:$/g, "").replace(/[_-]+/g, " ");
}

function scoreEmoji(emoji: EmojiDataEmoji, query: string) {
  const normalizedShortcodes = emoji.shortcodes.map(normalizeQuery);
  return (
    (emoji.label.toLocaleLowerCase().includes(query) ? 10 : 0) +
    emoji.tags.reduce((score, tag) => score + Number(tag.toLocaleLowerCase().includes(query)), 0) +
    normalizedShortcodes.reduce(
      (score, shortcode) => score + (shortcode === query ? 20 : Number(shortcode.includes(query))),
      0,
    )
  );
}

export function searchEmojis(
  emojis: EmojiDataEmoji[],
  search = "",
  englishEmojis: EmojiDataEmoji[] = [],
) {
  const query = normalizeQuery(search);
  if (!query) return emojis;

  const englishByEmoji = new Map(englishEmojis.map((emoji) => [emoji.emoji, emoji]));
  return emojis
    .map((emoji) => ({
      emoji,
      score:
        scoreEmoji(emoji, query) +
        (englishByEmoji.get(emoji.emoji) ? scoreEmoji(englishByEmoji.get(emoji.emoji)!, query) : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ emoji }) => emoji);
}

export function findEmoji(data: EmojiData | undefined, emoji: string) {
  return data?.emojis.find(
    (item) => item.emoji === emoji || Object.values(item.skins ?? {}).includes(emoji),
  );
}

export function getEmojiLabel(data: EmojiData | undefined, emoji: string) {
  return findEmoji(data, emoji)?.label;
}

function toEmoji(item: EmojiDataEmoji, skinTone: SkinTone): Emoji {
  return {
    emoji: skinTone !== "none" ? (item.skins?.[skinTone] ?? item.emoji) : item.emoji,
    label: item.label,
    shortcode:
      item.shortcodes[0] ??
      `:${item.label
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "_")
        .replace(/^_|_$/g, "")}:`,
  };
}

export function getEmojiPickerData(
  data: EmojiData,
  columns: number,
  skinTone: SkinTone,
  search: string,
  options: {
    englishEmojis?: EmojiDataEmoji[];
    recentEmojis?: CustomEmoji[];
    customEmojis?: CustomEmoji[];
    recentLabel?: string;
    customLabel?: string;
  } = {},
): EmojiPickerData {
  const rows: EmojiPickerData["rows"] = [];
  const categories: EmojiPickerData["categories"] = [];
  const categoriesStartRowIndices: number[] = [];
  const grouped: Array<{ label: string; emojis: Emoji[] }> = [];
  const results = searchEmojis(data.emojis, search, options.englishEmojis);

  if (!search && options.recentEmojis?.length)
    grouped.push({ label: options.recentLabel ?? "Recently used", emojis: options.recentEmojis });
  if (!search && options.customEmojis?.length)
    grouped.push({ label: options.customLabel ?? "Custom", emojis: options.customEmojis });

  const byCategory = new Map<number, EmojiDataEmoji[]>();
  for (const emoji of results) {
    const collection = byCategory.get(emoji.category) ?? [];
    collection.push(emoji);
    byCategory.set(emoji.category, collection);
  }
  for (const category of data.categories) {
    const emojis = byCategory.get(category.index);
    if (emojis?.length)
      grouped.push({
        label: category.label,
        emojis: emojis.map((emoji) => toEmoji(emoji, skinTone)),
      });
  }

  let startRowIndex = 0;
  for (const group of grouped) {
    const categoryIndex = categories.length;
    const categoryRows = Array.from(
      { length: Math.ceil(group.emojis.length / columns) },
      (_, index) => ({
        categoryIndex,
        emojis: group.emojis.slice(index * columns, (index + 1) * columns),
      }),
    );
    rows.push(...categoryRows);
    categories.push({ label: group.label, rowsCount: categoryRows.length, startRowIndex });
    categoriesStartRowIndices.push(startRowIndex);
    startRowIndex += categoryRows.length;
  }

  return {
    count:
      results.length +
      (!search ? (options.recentEmojis?.length ?? 0) + (options.customEmojis?.length ?? 0) : 0),
    categories,
    categoriesStartRowIndices,
    rows,
    skinTones: data.skinTones,
  };
}
