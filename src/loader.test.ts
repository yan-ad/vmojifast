import { afterEach, describe, expect, it, vi } from "vitest";
import { clearEmojiDataCache, loadEmojiData } from "./loader";

const data = [{ emoji: "😀", label: "grinning face", group: 0, version: 1 }];
const messages = {
  groups: [{ key: "smileys", message: "Smileys & Emotion" }],
  skinTones: [],
};

afterEach(() => {
  clearEmojiDataCache();
  vi.unstubAllGlobals();
});

describe("loadEmojiData", () => {
  it("falls back to the next source when a CDN is unavailable", async () => {
    const fetch = vi.fn(async (url: string) => {
      if (url.startsWith("https://down.example")) return new Response(null, { status: 503 });
      return new Response(JSON.stringify(url.endsWith("data.json") ? data : messages));
    });
    vi.stubGlobal("fetch", fetch);

    await expect(
      loadEmojiData("en", ["https://down.example", "https://up.example/"]),
    ).resolves.toMatchObject({
      emojis: [{ emoji: "😀", label: "grinning face" }],
    });
    expect(fetch).toHaveBeenCalledWith("https://up.example/en/data.json", { signal: undefined });
    expect(fetch).toHaveBeenCalledWith("https://up.example/en/messages.json", {
      signal: undefined,
    });
  });

  it("supports a single self-hosted source", async () => {
    const fetch = vi.fn(
      async (url: string) =>
        new Response(JSON.stringify(url.endsWith("data.json") ? data : messages)),
    );
    vi.stubGlobal("fetch", fetch);

    const result = await loadEmojiData("en", "/emoji-data");
    expect(result.emojis[0]?.emoji).toBe("😀");
    expect(fetch).toHaveBeenCalledWith("/emoji-data/en/data.json", { signal: undefined });
  });
});
