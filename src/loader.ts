import type { EmojiData, SkinTone } from "./types";

const DEFAULT_URL = "https://cdn.jsdelivr.net/npm/emojibase-data";
const toneByNumber: Record<number, Exclude<SkinTone, "none">> = {
  1: "light",
  2: "medium-light",
  3: "medium",
  4: "medium-dark",
  5: "dark",
};
const cache = new Map<string, Promise<EmojiData>>();

interface EmojibaseMessage {
  key: string;
  message: string;
}
interface EmojibaseEmoji {
  emoji?: string;
  label?: string;
  tags?: string[];
  shortcodes?: string[];
  group?: number;
  version?: number;
  type?: number;
  skins?: Array<{ emoji?: string; tone?: number }>;
}

export async function loadEmojiData(
  locale = "en",
  baseUrl = DEFAULT_URL,
  signal?: AbortSignal,
): Promise<EmojiData> {
  const root = baseUrl.replace(/\/$/, "");
  const key = `${root}:${locale}`;
  if (!signal) {
    const cached = cache.get(key);
    if (cached) return cached;
  }

  const request = (async () => {
    const [emojiResponse, messagesResponse] = await Promise.all([
      fetch(`${root}/${locale}/data.json`, { signal }),
      fetch(`${root}/${locale}/messages.json`, { signal }),
    ]);
    if (!emojiResponse.ok || !messagesResponse.ok)
      throw new Error(`Unable to load Emojibase data for locale "${locale}".`);

    const rawEmojis = (await emojiResponse.json()) as EmojibaseEmoji[];
    const messages = (await messagesResponse.json()) as {
      groups?: EmojibaseMessage[];
      skinTones?: EmojibaseMessage[];
    };
    const groups = messages.groups ?? [];
    const categories = groups.map((group, index) => ({ index, label: group.message }));
    const groupIndex = new Map(groups.map((group, index) => [index, group]));
    const skinTones = Object.fromEntries(
      (messages.skinTones ?? []).flatMap((tone) => {
        const name = tone.key as SkinTone;
        return name !== "none" && Object.values(toneByNumber).includes(name)
          ? [[name, tone.message]]
          : [];
      }),
    ) as EmojiData["skinTones"];

    const emojis = rawEmojis.flatMap((item) => {
      if (!item.emoji || item.group === undefined || !groupIndex.has(item.group)) return [];
      const skins = Object.fromEntries(
        (item.skins ?? []).flatMap((skin) => {
          const tone = skin.tone === undefined ? undefined : toneByNumber[skin.tone];
          return tone && skin.emoji ? [[tone, skin.emoji]] : [];
        }),
      ) as NonNullable<EmojiData["emojis"][number]["skins"]>;
      const shortcodes = (item.shortcodes ?? []).map(
        (shortcode) => `:${shortcode.replace(/^:|:$/g, "")}:`,
      );
      if (!shortcodes.length && item.label)
        shortcodes.push(
          `:${item.label
            .toLocaleLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "_")
            .replace(/^_|_$/g, "")}:`,
        );
      return [
        {
          emoji: item.emoji,
          label: item.label ?? item.emoji,
          category: item.group,
          version: item.version ?? 0,
          tags: item.tags ?? [],
          shortcodes,
          shortcode: shortcodes[0],
          countryFlag: item.type === 4 ? (true as const) : undefined,
          skins: Object.keys(skins).length ? skins : undefined,
        },
      ];
    });
    return { locale, emojis, categories, skinTones };
  })();

  if (!signal) cache.set(key, request);
  try {
    return await request;
  } catch (error) {
    cache.delete(key);
    throw error;
  }
}

/** Clear cached Emojibase payloads, useful after changing the data source. */
export function clearEmojiDataCache() {
  cache.clear();
}
