<script setup lang="ts">
import { useEmojiPicker } from "../context";
import type { SkinTone } from "../types";

const picker = useEmojiPicker();
const emit = defineEmits<{ "update:skinTone": [value: SkinTone] }>();

const toneOptions: Array<{ tone: SkinTone; emoji: string }> = [
  { tone: "none", emoji: "👋" },
  { tone: "light", emoji: "👋🏻" },
  { tone: "medium-light", emoji: "👋🏼" },
  { tone: "medium", emoji: "👋🏽" },
  { tone: "medium-dark", emoji: "👋🏾" },
  { tone: "dark", emoji: "👋🏿" },
];

function labelFor(tone: SkinTone) {
  if (tone === "none") return "Default skin tone";
  return picker.pickerData.value?.skinTones[tone] ?? tone;
}

function select(value: SkinTone) {
  picker.skinTone.value = value;
  emit("update:skinTone", value);
}
</script>

<template>
  <div
    vmojifast-skin-tone-selector
    data-vmojifast-skin-tone-selector
    role="group"
    aria-label="Skin tone"
  >
    <button
      v-for="option in toneOptions"
      :key="option.tone"
      type="button"
      vmojifast-skin-tone
      data-vmojifast-skin-tone
      :aria-label="labelFor(option.tone)"
      :aria-pressed="picker.skinTone.value === option.tone"
      :data-vmojifast-active="picker.skinTone.value === option.tone || undefined"
      :data-vmojifast-selected="picker.skinTone.value === option.tone || undefined"
      @click="select(option.tone)"
    >
      <slot :skin-tone="option.tone" :emoji="option.emoji" :label="labelFor(option.tone)">
        {{ option.emoji }}
      </slot>
    </button>
  </div>
</template>
