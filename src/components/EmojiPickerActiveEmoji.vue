<script setup lang="ts">
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
</script>
<template><slot :emoji="picker.activeEmoji" /></template>
