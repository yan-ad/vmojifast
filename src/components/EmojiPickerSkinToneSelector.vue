<script setup lang="ts">
import { computed } from "vue";
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
const emit = defineEmits<{ "update:skinTone": [value: import("../types").SkinTone] }>();
const tones = computed(() => ({ none: "✋", ...(picker.pickerData.value?.skinTones ?? {}) }));
function select(value: import("../types").SkinTone) {
  picker.skinTone.value = value;
  emit("update:skinTone", value);
}
</script>
<template>
  <div vmojifast-skin-tone-selector>
    <button
      v-for="(label, tone) in tones"
      :key="tone"
      type="button"
      vmojifast-skin-tone
      :aria-label="String(label)"
      :aria-pressed="picker.skinTone.value === tone"
      @click="select(tone as import('../types').SkinTone)"
    >
      <slot :skin-tone="tone" :label="label">{{ label }}</slot>
    </button>
  </div>
</template>
