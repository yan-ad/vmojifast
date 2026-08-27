<script setup lang="ts">
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
</script>
<template>
  <input frimousse-search type="search" :value="picker.search.value" @input="picker.search.value = ($event.target as HTMLInputElement).value" />
</template>
