# vue-frimousse

Vue 3 port of [Liveblocks Frimousse](https://github.com/liveblocks/frimousse): an unstyled, composable emoji picker powered by Emojibase.

## Install

```bash
npm install vue-frimousse
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { EmojiPicker, type Emoji, type SkinTone } from "vue-frimousse";

const skinTone = ref<SkinTone>("none");
function insertEmoji({ emoji }: Emoji) { console.log(emoji); }
</script>

<template>
  <EmojiPicker.Root v-model:skin-tone="skinTone" :columns="8" @emoji-select="insertEmoji">
    <EmojiPicker.Search placeholder="Search emoji" />
    <EmojiPicker.Viewport class="picker-viewport">
      <EmojiPicker.List>
        <template #emoji="{ emoji }"><span>{{ emoji.emoji }}</span></template>
      </EmojiPicker.List>
    </EmojiPicker.Viewport>
    <EmojiPicker.SkinToneSelector />
    <EmojiPicker.ActiveEmoji v-slot="{ emoji }">{{ emoji?.label }}</EmojiPicker.ActiveEmoji>
  </EmojiPicker.Root>
</template>
```

All components are deliberately unstyled. Target the `frimousse-*` attributes to style them.

`Root` props: `locale`, `columns`, `sticky`, `skin-tone`, `emojibase-url`, and `emoji-version`.
It emits `emoji-select`, `update:skin-tone`, and `error`. `List` supplies `loading`, `error`, `empty`, `category`, `row`, and `emoji` slots.
