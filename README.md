# vmojifast

[![npm version](https://img.shields.io/npm/v/vmojifast?logo=npm&label=npm)](https://www.npmjs.com/package/vmojifast)
[![npm downloads](https://img.shields.io/npm/dw/vmojifast?logo=npm&label=downloads)](https://www.npmjs.com/package/vmojifast)
[![GitHub repository](https://img.shields.io/badge/GitHub-yan--ad%2Fvmoji-181717?logo=github)](https://github.com/yan-ad/vmoji)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An unstyled, composable emoji picker for Vue 3, powered by Emojibase.

**Repository:** [github.com/yan-ad/vmoji](https://github.com/yan-ad/vmoji)

## Install

```bash
npm install vmojifast
```

## Usage

Import each component directly from `vmojifast`:

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  EmojiPickerActiveEmoji,
  EmojiPickerList,
  EmojiPickerRoot,
  EmojiPickerSearch,
  EmojiPickerSkinToneSelector,
  EmojiPickerViewport,
  type Emoji,
  type SkinTone,
} from "vmojifast";

const skinTone = ref<SkinTone>("none");
function insertEmoji({ emoji }: Emoji) {
  console.log(emoji);
}
</script>

<template>
  <EmojiPickerRoot v-model:skin-tone="skinTone" :columns="8" @emoji-select="insertEmoji">
    <EmojiPickerSearch placeholder="Search emoji" />
    <EmojiPickerViewport class="picker-viewport">
      <EmojiPickerList>
        <template #emoji="{ emoji }"
          ><span>{{ emoji.emoji }}</span></template
        >
      </EmojiPickerList>
    </EmojiPickerViewport>
    <EmojiPickerSkinToneSelector />
    <EmojiPickerActiveEmoji v-slot="{ emoji }">{{ emoji?.label }}</EmojiPickerActiveEmoji>
  </EmojiPickerRoot>
</template>
```

## Recent, custom, and controlled search

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  EmojiPickerList,
  EmojiPickerRoot,
  EmojiPickerSearch,
  EmojiPickerViewport,
  type CustomEmoji,
} from "vmojifast";

const search = ref("");
const recentEmojis = ref<CustomEmoji[]>([{ emoji: "🎉", label: "party popper" }]);
const customEmojis: CustomEmoji[] = [{ emoji: "<:shipit:123>", label: "Ship it", id: "shipit" }];
</script>

<template>
  <EmojiPickerRoot
    v-model:search="search"
    :recent-emojis="recentEmojis"
    :custom-emojis="customEmojis"
  >
    <EmojiPickerSearch />
    <EmojiPickerViewport><EmojiPickerList /></EmojiPickerViewport>
  </EmojiPickerRoot>
</template>
```

Search accepts localized labels, English labels/tags, and Emojibase shortcodes such as `:grinning_face:`. Custom emoji rendering stays headless—use the `EmojiPickerList` `#emoji` slot to render application-specific image or markup.

## Styling state

All components are deliberately unstyled. Every primitive exposes stable `data-vmojifast-*`
attributes, so styling never requires application-owned hover or selection state.

| Selector                                                                       | Meaning                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-vmojifast-root]`                                                        | Picker root; `data-vmojifast-loading` and `data-vmojifast-error` reflect its load state.                                                                                                |
| `[data-vmojifast-search]`                                                      | Search input; has `data-vmojifast-empty` with no query.                                                                                                                                 |
| `[data-vmojifast-viewport]`                                                    | Scrollable, keyboard-navigable grid viewport.                                                                                                                                           |
| `[data-vmojifast-list]`, `[data-vmojifast-category]`, `[data-vmojifast-row]`   | Emoji grid structure.                                                                                                                                                                   |
| `[data-vmojifast-emoji]`                                                       | Emoji button. `data-vmojifast-active` and `data-vmojifast-highlighted` are set on hover, focus, and keyboard navigation; `data-vmojifast-selected` is set after click, Enter, or Space. |
| `[data-vmojifast-skin-tone]`                                                   | Skin-tone control; active choice gets `data-vmojifast-active` and `data-vmojifast-selected`.                                                                                            |
| `[data-vmojifast-loading]`, `[data-vmojifast-error]`, `[data-vmojifast-empty]` | Status primitives from `EmojiPickerList`.                                                                                                                                               |

```css
[data-vmojifast-emoji][data-vmojifast-highlighted] {
  background: #f4f4f5;
  border-radius: 0.5rem;
}

[data-vmojifast-emoji][data-vmojifast-selected] {
  outline: 2px solid #7c3aed;
}
```

`EmojiPickerRoot` props: `locale`, `columns`, `sticky`, `skin-tone`, `search`, `recent-emojis`, `custom-emojis`, `recent-label`, `custom-label`, `emojibase-url`, and `emoji-version`.
It emits `emoji-select`, `update:skin-tone`, `update:search`, and `error`. `EmojiPickerList` supplies `loading`, `error`, `empty`, `category`, `row`, and `emoji` slots.

## Reliable emoji data loading

By default, data is loaded from version-pinned Emojibase mirrors in order: **jsDelivr**, then **unpkg**. If jsDelivr is unavailable, the picker automatically retries unpkg. Host a copy yourself to remove external CDN dependency entirely:

```vue
<EmojiPickerRoot emojibase-url="/emoji-data/emojibase-data@16.0.0" />
```

For several internal/CDN mirrors, pass an ordered array; each source must expose `/{locale}/data.json` and `/{locale}/messages.json`:

```vue
<EmojiPickerRoot :emojibase-url="['https://emoji.example.com', '/emoji-data']" />
```

Data helpers `findEmoji`, `getEmojiLabel`, `searchEmojis`, `loadEmojiData`, `clearEmojiDataCache`, and `DEFAULT_EMOJIBASE_URLS` are exported for custom integrations.
