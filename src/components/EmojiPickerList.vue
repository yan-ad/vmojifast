<script setup lang="ts">
import { computed } from "vue";
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
const empty = computed(() => !picker.loading.value && !picker.error.value && picker.pickerData.value?.count === 0);
</script>
<template>
  <span v-if="picker.loading.value" frimousse-loading><slot name="loading">Loading…</slot></span>
  <span v-else-if="picker.error.value" frimousse-error><slot name="error" :error="picker.error.value">Unable to load emoji.</slot></span>
  <span v-else-if="empty" frimousse-empty><slot name="empty" :search="picker.search">No emoji found.</slot></span>
  <div v-else frimousse-list role="rowgroup">
    <template v-for="(category, categoryIndex) in picker.pickerData.value?.categories" :key="category.label">
      <slot name="category" :category="category" :index="categoryIndex">
        <div frimousse-category :style="picker.sticky ? { position: 'sticky', top: '0' } : undefined">{{ category.label }}</div>
      </slot>
      <div v-for="row in picker.pickerData.value?.rows.slice(category.startRowIndex, category.startRowIndex + category.rowsCount)" :key="`${categoryIndex}-${row.emojis[0]?.emoji}`" frimousse-row role="row">
        <slot name="row" :row="row" :category="category" :index="categoryIndex">
          <button v-for="emoji in row.emojis" :key="emoji.emoji" frimousse-emoji type="button" role="gridcell" :aria-label="emoji.label"
            :data-active="picker.activeEmoji.value?.emoji === emoji.emoji || undefined"
            @pointerenter="picker.activeEmoji.value = emoji" @focus="picker.activeEmoji.value = emoji" @click="picker.select(emoji)">
            <slot name="emoji" :emoji="emoji">{{ emoji.emoji }}</slot>
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>
