export type Locale = string;
export type SkinTone = "none" | "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export interface Emoji {
  emoji: string;
  label: string;
}

export interface EmojiDataEmoji extends Emoji {
  category: number;
  version: number;
  tags: string[];
  countryFlag?: true;
  skins?: Partial<Record<Exclude<SkinTone, "none">, string>>;
}

export interface EmojiDataCategory {
  index: number;
  label: string;
}

export interface EmojiData {
  locale: Locale;
  emojis: EmojiDataEmoji[];
  categories: EmojiDataCategory[];
  skinTones: Record<Exclude<SkinTone, "none">, string>;
}

export interface EmojiPickerRow {
  categoryIndex: number;
  emojis: Emoji[];
}

export interface EmojiPickerCategory {
  label: string;
  rowsCount: number;
  startRowIndex: number;
}

export interface EmojiPickerData {
  count: number;
  categories: EmojiPickerCategory[];
  categoriesStartRowIndices: number[];
  rows: EmojiPickerRow[];
  skinTones: Record<Exclude<SkinTone, "none">, string>;
}
