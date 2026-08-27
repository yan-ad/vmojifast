<script setup lang="ts">
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
</script>
<template>
  <input
    vmoji-search
    type="search"
    :value="picker.search.value"
    @input="picker.setSearch(($event.target as HTMLInputElement).value)"
  />
</template>
