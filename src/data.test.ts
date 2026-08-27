import { describe, expect, it } from "vitest";
import { findEmoji, getEmojiLabel, searchEmojis } from "./data";
import type { EmojiData, EmojiDataEmoji } from "./types";

const emojis: EmojiDataEmoji[] = [
  {
    emoji: "😀",
    label: "grinning face",
    category: 0,
    version: 1,
    tags: ["smile", "happy", "joy"],
    shortcode: ":grinning_face:",
    shortcodes: [":grinning_face:"],
  },
  {
    emoji: "🙂",
    label: "slightly smiling face",
    category: 0,
    version: 1,
    tags: ["smile", "happy"],
    shortcode: ":slightly_smiling_face:",
    shortcodes: [":slightly_smiling_face:"],
  },
  {
    emoji: "🫨",
    label: "shaking face",
    category: 0,
    version: 15,
    tags: ["shake", "vibrate", "shocked"],
    shortcode: ":shaking_face:",
    shortcodes: [":shaking_face:"],
  },
  {
    emoji: "👍",
    label: "thumbs up",
    category: 1,
    version: 1,
    tags: ["approve", "like"],
    shortcode: ":thumbs_up:",
    shortcodes: [":thumbs_up:"],
    skins: { light: "👍🏻", dark: "👍🏿" },
  },
];

const data: EmojiData = {
  locale: "en",
  emojis,
  categories: [],
  skinTones: {
    light: "Light",
    "medium-light": "Medium-Light",
    medium: "Medium",
    "medium-dark": "Medium-Dark",
    dark: "Dark",
  },
};

describe("emoji data helpers", () => {
  it("finds standard and skin-tone emoji by Unicode", () => {
    expect(findEmoji(data, "😀")?.label).toBe("grinning face");
    expect(findEmoji(data, "👍🏿")?.label).toBe("thumbs up");
  });

  it("returns accessible labels for detected emoji", () => {
    expect(getEmojiLabel(data, "🙂")).toBe("slightly smiling face");
    expect(getEmojiLabel(data, "🫨")).toBe("shaking face");
    expect(getEmojiLabel(data, "not-an-emoji")).toBeUndefined();
  });

  it("finds smile emoji by label and tags", () => {
    expect(searchEmojis(emojis, "smile").map(({ emoji }) => emoji)).toEqual(["😀", "🙂"]);
  });

  it("finds shaking face by label, tag, and colon-wrapped shortcode", () => {
    expect(searchEmojis(emojis, "shake")[0]?.emoji).toBe("🫨");
    expect(searchEmojis(emojis, ":shaking_face:")[0]?.emoji).toBe("🫨");
  });
});
