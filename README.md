# vmojifast

An unstyled, composable emoji picker for Vue 3, powered by Emojibase.

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

All components are deliberately unstyled. Target the `vmojifast-*` attributes to style them.

`EmojiPickerRoot` props: `locale`, `columns`, `sticky`, `skin-tone`, `search`, `recent-emojis`, `custom-emojis`, `recent-label`, `custom-label`, `emojibase-url`, and `emoji-version`.
It emits `emoji-select`, `update:skin-tone`, `update:search`, and `error`. `EmojiPickerList` supplies `loading`, `error`, `empty`, `category`, `row`, and `emoji` slots.

Data helpers `findEmoji`, `getEmojiLabel`, `searchEmojis`, `loadEmojiData`, and `clearEmojiDataCache` are exported for custom integrations.
