<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EmojiPickerActiveEmoji,
  EmojiPickerList,
  EmojiPickerRoot,
  EmojiPickerSearch,
  EmojiPickerSkinToneSelector,
  EmojiPickerViewport,
  type Emoji,
  type SkinTone,
} from "vmojifast";

const skinTone = ref<SkinTone>("none");
const search = ref("");
const selectedEmoji = ref<Emoji | null>(null);
const pickedLabel = computed(() => selectedEmoji.value?.label ?? "Hover an emoji");
</script>

<template>
  <main class="demo-page">
    <header class="site-nav">
      <a
        class="wordmark"
        href="https://github.com/yan-ad/vmojifast"
        target="_blank"
        rel="noreferrer"
      >
        <span class="mark">v</span>mojifast
      </a>
      <a
        class="github-link"
        href="https://github.com/yan-ad/vmojifast"
        target="_blank"
        rel="noreferrer"
      >
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>

    <section class="demo-stage" aria-label="vmojifast emoji picker demo">
      <div class="intro">
        <p>EMOJI PICKER FOR VUE 3</p>
        <h1>Pick an <em>emoji.</em></h1>
      </div>

      <div class="picker-frame">
        <EmojiPickerRoot
          v-model:search="search"
          v-model:skin-tone="skinTone"
          :columns="8"
          @emoji-select="selectedEmoji = $event"
        >
          <section class="picker-card" aria-label="Emoji picker">
            <div class="picker-toolbar">
              <EmojiPickerSearch
                class="emoji-search"
                placeholder="Search..."
                aria-label="Search emojis"
              />
            </div>

            <EmojiPickerViewport class="emoji-viewport">
              <EmojiPickerList>
                <template #category="{ category }"
                  ><h2 class="category-title">{{ category.label }}</h2></template
                >
                <template #loading><div class="picker-notice">Loading emoji...</div></template>
                <template #empty><div class="picker-notice">No emoji found.</div></template>
              </EmojiPickerList>
            </EmojiPickerViewport>

            <footer class="picker-footer">
              <EmojiPickerActiveEmoji v-slot="{ emoji }">
                <div class="active-readout" aria-live="polite">
                  <span class="active-glyph">{{
                    emoji?.emoji ?? selectedEmoji?.emoji ?? "✦"
                  }}</span>
                  <span>{{ emoji?.label ?? pickedLabel }}</span>
                </div>
              </EmojiPickerActiveEmoji>
              <EmojiPickerSkinToneSelector class="tone-selector" aria-label="Choose skin tone" />
            </footer>
          </section>
        </EmojiPickerRoot>
      </div>
    </section>
  </main>
</template>
