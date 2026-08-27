<script setup lang="ts">
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
</script>
<template>
  <input
    vmojifast-search
    data-vmojifast-search
    type="search"
    :value="picker.search.value"
    :data-vmojifast-empty="!picker.search.value || undefined"
    @input="picker.setSearch(($event.target as HTMLInputElement).value)"
  />
</template>
