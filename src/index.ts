import Root from "./components/EmojiPickerRoot.vue";
import Search from "./components/EmojiPickerSearch.vue";
import Viewport from "./components/EmojiPickerViewport.vue";
import List from "./components/EmojiPickerList.vue";
import SkinToneSelector from "./components/EmojiPickerSkinToneSelector.vue";
import ActiveEmoji from "./components/EmojiPickerActiveEmoji.vue";

export const EmojiPicker = { Root, Search, Viewport, List, SkinToneSelector, ActiveEmoji };
export { default as EmojiPickerRoot } from "./components/EmojiPickerRoot.vue";
export { default as EmojiPickerSearch } from "./components/EmojiPickerSearch.vue";
export { default as EmojiPickerViewport } from "./components/EmojiPickerViewport.vue";
export { default as EmojiPickerList } from "./components/EmojiPickerList.vue";
export { default as EmojiPickerSkinToneSelector } from "./components/EmojiPickerSkinToneSelector.vue";
export { default as EmojiPickerActiveEmoji } from "./components/EmojiPickerActiveEmoji.vue";
export { loadEmojiData } from "./loader";
export { getEmojiPickerData, searchEmojis } from "./data";
export type * from "./types";
