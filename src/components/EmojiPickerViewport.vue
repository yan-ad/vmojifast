<script setup lang="ts">
import { computed, ref } from "vue";
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
const viewport = ref<HTMLElement>();
const activeIndex = computed(
  () =>
    picker.pickerData.value?.rows
      .flatMap((row) => row.emojis)
      .findIndex((emoji) => emoji.emoji === picker.activeEmoji.value?.emoji) ?? -1,
);
function setActive(index: number) {
  const emoji = picker.pickerData.value?.rows.flatMap((row) => row.emojis)[index];
  if (emoji) picker.activeEmoji.value = emoji;
}
function keydown(event: KeyboardEvent) {
  const data = picker.pickerData.value;
  if (!data) return;
  const all = data.rows.flatMap((row) => row.emojis);
  let index = activeIndex.value < 0 ? 0 : activeIndex.value;
  if (event.key === "ArrowRight") index += 1;
  else if (event.key === "ArrowLeft") index -= 1;
  else if (event.key === "ArrowDown") index += picker.columns.value;
  else if (event.key === "ArrowUp") index -= picker.columns.value;
  else if (event.key === "Enter" || event.key === " ") {
    if (picker.activeEmoji.value) picker.select(picker.activeEmoji.value);
    return;
  } else return;
  event.preventDefault();
  setActive(Math.max(0, Math.min(all.length - 1, index)));
}
</script>
<template>
  <div ref="viewport" vmojifast-viewport role="grid" tabindex="0" @keydown="keydown"><slot /></div>
</template>
