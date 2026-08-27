<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { createEmojiPicker } from "../context";
import type { Emoji, SkinTone } from "../types";

const props = withDefaults(defineProps<{
  locale?: string;
  columns?: number;
  sticky?: boolean;
  skinTone?: SkinTone;
  emojibaseUrl?: string;
  emojiVersion?: number;
}>(), { locale: "en", columns: 10, sticky: true, skinTone: "none", emojibaseUrl: "https://cdn.jsdelivr.net/npm/emojibase-data" });
const emit = defineEmits<{ "emoji-select": [emoji: Emoji]; "update:skinTone": [value: SkinTone]; error: [error: Error] }>();
const skinTone = computed({ get: () => props.skinTone, set: (value) => emit("update:skinTone", value) });
const picker = createEmojiPicker({
  locale: computed(() => props.locale), columns: computed(() => Math.max(1, props.columns)), sticky: computed(() => props.sticky),
  skinTone, emojibaseUrl: computed(() => props.emojibaseUrl), emojiVersion: computed(() => props.emojiVersion), onEmojiSelect: (emoji) => emit("emoji-select", emoji),
});
watch([() => props.locale, () => props.emojibaseUrl], picker.reload, { immediate: true });
watch(picker.context.error, (error) => { if (error) emit("error", error); });
onBeforeUnmount(picker.dispose);
</script>

<template><div frimousse-root><slot /></div></template>
