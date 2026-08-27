export type SkinTone = "none" | "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export interface Emoji {
  emoji: string;
  label: string;
  /** An Emojibase shortcode such as `:grinning_face:` when available. */
  shortcode?: string;
}

/** A user-provided emoji, suitable for recent and custom categories. */
export interface CustomEmoji extends Emoji {
  id?: string;
}

export interface EmojiDataEmoji extends Emoji {
  category: number;
  version: number;
  tags: string[];
  /** All Emojibase shortcodes, normalized with surrounding colons. */
  shortcodes: string[];
  countryFlag?: true;
  skins?: Partial<Record<Exclude<SkinTone, "none">, string>>;
}

export interface EmojiDataCategory {
  index: number;
  label: string;
}

export interface EmojiData {
  locale: string;
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
