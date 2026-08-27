<script setup lang="ts">
import { computed } from "vue";
import { useEmojiPicker } from "../context";
const picker = useEmojiPicker();
const empty = computed(
  () => !picker.loading.value && !picker.error.value && picker.pickerData.value?.count === 0,
);
</script>
<template>
  <span v-if="picker.loading.value" vmojifast-loading data-vmojifast-loading>
    <slot name="loading">Loading…</slot>
  </span>
  <span v-else-if="picker.error.value" vmojifast-error data-vmojifast-error>
    <slot name="error" :error="picker.error.value">Unable to load emoji.</slot>
  </span>
  <span v-else-if="empty" vmojifast-empty data-vmojifast-empty>
    <slot name="empty" :search="picker.search">No emoji found.</slot>
  </span>
  <div v-else vmojifast-list data-vmojifast-list role="rowgroup">
    <template
      v-for="(category, categoryIndex) in picker.pickerData.value?.categories"
      :key="category.label"
    >
      <slot name="category" :category="category" :index="categoryIndex">
        <div
          vmojifast-category
          data-vmojifast-category
          :style="picker.sticky ? { position: 'sticky', top: '0' } : undefined"
        >
          {{ category.label }}
        </div>
      </slot>
      <div
        v-for="row in picker.pickerData.value?.rows.slice(
          category.startRowIndex,
          category.startRowIndex + category.rowsCount,
        )"
        :key="`${categoryIndex}-${row.emojis[0]?.emoji}`"
        vmojifast-row
        data-vmojifast-row
        role="row"
      >
        <slot name="row" :row="row" :category="category" :index="categoryIndex">
          <button
            v-for="emoji in row.emojis"
            :key="emoji.emoji"
            vmojifast-emoji
            data-vmojifast-emoji
            type="button"
            role="gridcell"
            :aria-label="emoji.label"
            :data-vmojifast-active="picker.activeEmoji.value?.emoji === emoji.emoji || undefined"
            :data-vmojifast-highlighted="
              picker.activeEmoji.value?.emoji === emoji.emoji || undefined
            "
            :data-vmojifast-selected="
              picker.selectedEmoji.value?.emoji === emoji.emoji || undefined
            "
            @mouseenter="picker.activeEmoji.value = emoji"
            @pointerenter="picker.activeEmoji.value = emoji"
            @focus="picker.activeEmoji.value = emoji"
            @click="picker.select(emoji)"
          >
            <slot name="emoji" :emoji="emoji">{{ emoji.emoji }}</slot>
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>
