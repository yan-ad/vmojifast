<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { createEmojiPicker } from "../context";
import type { CustomEmoji, Emoji, SkinTone } from "../types";

const props = withDefaults(
  defineProps<{
    locale?: string;
    columns?: number;
    sticky?: boolean;
    skinTone?: SkinTone;
    search?: string;
    recentEmojis?: CustomEmoji[];
    customEmojis?: CustomEmoji[];
    recentLabel?: string;
    customLabel?: string;
    emojibaseUrl?: string;
    emojiVersion?: number;
  }>(),
  {
    locale: "en",
    columns: 10,
    sticky: true,
    skinTone: "none",
    recentEmojis: () => [],
    customEmojis: () => [],
    emojibaseUrl: "https://cdn.jsdelivr.net/npm/emojibase-data",
  },
);
const emit = defineEmits<{
  "emoji-select": [emoji: Emoji];
  "update:skinTone": [value: SkinTone];
  "update:search": [value: string];
  error: [error: Error];
}>();
const skinTone = computed({
  get: () => props.skinTone,
  set: (value) => emit("update:skinTone", value),
});
const picker = createEmojiPicker({
  locale: computed(() => props.locale),
  columns: computed(() => Math.max(1, props.columns)),
  sticky: computed(() => props.sticky),
  skinTone,
  searchValue: computed(() => props.search),
  recentEmojis: computed(() => props.recentEmojis),
  customEmojis: computed(() => props.customEmojis),
  recentLabel: computed(() => props.recentLabel),
  customLabel: computed(() => props.customLabel),
  emojibaseUrl: computed(() => props.emojibaseUrl),
  emojiVersion: computed(() => props.emojiVersion),
  onEmojiSelect: (emoji) => emit("emoji-select", emoji),
  onSearchChange: (value) => emit("update:search", value),
});
watch([() => props.locale, () => props.emojibaseUrl], picker.reload, { immediate: true });
watch(picker.context.error, (error) => {
  if (error) emit("error", error);
});
onBeforeUnmount(picker.dispose);
</script>

<template>
  <div vmojifast-root><slot /></div>
</template>
