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
const message = ref("A fast Vue emoji picker, without the visual baggage.");
const recentEmojis = ref<Emoji[]>([]);
const selectedEmoji = ref<Emoji | null>(null);

const status = computed(() => selectedEmoji.value?.label ?? "Hover an emoji to inspect it");

function selectEmoji(emoji: Emoji) {
  message.value += emoji.emoji;
  selectedEmoji.value = emoji;
  recentEmojis.value = [
    emoji,
    ...recentEmojis.value.filter(({ emoji: value }) => value !== emoji.emoji),
  ].slice(0, 8);
}
</script>

<template>
  <main class="page-shell">
    <header class="masthead">
      <a
        class="wordmark"
        href="https://www.npmjs.com/package/vmojifast"
        target="_blank"
        rel="noreferrer"
      >
        vmoji<span>fast</span>
      </a>
      <p>Vue 3 emoji picker · composable by default</p>
      <a
        class="repo-link"
        href="https://github.com/liveblocks/frimousse"
        target="_blank"
        rel="noreferrer"
      >
        Inspired by Frimousse ↗
      </a>
    </header>

    <section class="hero" aria-labelledby="demo-heading">
      <div class="hero-copy">
        <p class="eyebrow">Live proof of concept</p>
        <h1 id="demo-heading">Emoji selection,<br /><em>minus the ceremony.</em></h1>
        <p class="lede">
          A fully unstyled primitive, dressed here with a warm editorial skin. Search, tone
          selection, active state, and recents are all live.
        </p>
        <div class="feature-strip" aria-label="Demo features">
          <span>01 · Searchable</span><span>02 · Tone-aware</span><span>03 · Recent history</span>
        </div>
      </div>

      <div class="composer-card">
        <div class="composer-topline">
          <span>MESSAGE COMPOSER</span><span class="live-dot">LIVE</span>
        </div>
        <label class="message-field">
          <span class="sr-only">Message</span>
          <textarea v-model="message" rows="4" />
        </label>
        <div class="composer-footer">
          <span>{{ message.length }} characters</span>
          <button type="button" @click="message = ''">Clear</button>
        </div>
      </div>
    </section>

    <section class="picker-section" aria-label="Emoji picker example">
      <EmojiPickerRoot
        v-model:search="search"
        v-model:skin-tone="skinTone"
        :recent-emojis="recentEmojis"
        :columns="8"
        recent-label="Recently used"
        @emoji-select="selectEmoji"
      >
        <div class="picker-card">
          <div class="picker-toolbar">
            <EmojiPickerSearch class="emoji-search" placeholder="Find an emoji…" />
            <EmojiPickerSkinToneSelector class="tone-selector" />
          </div>

          <EmojiPickerViewport class="emoji-viewport">
            <EmojiPickerList>
              <template #category="{ category }">
                <div class="category-title">{{ category.label }}</div>
              </template>
              <template #loading><div class="picker-notice">Collecting tiny faces…</div></template>
              <template #empty
                ><div class="picker-notice">No tiny face found for “{{ search }}”.</div></template
              >
            </EmojiPickerList>
          </EmojiPickerViewport>

          <footer class="picker-footer">
            <div class="active-readout">
              <span class="active-glyph"
                ><EmojiPickerActiveEmoji v-slot="{ emoji }">{{
                  emoji?.emoji ?? "✦"
                }}</EmojiPickerActiveEmoji></span
              >
              <span>{{ status }}</span>
            </div>
            <span class="keyboard-hint">CLICK TO ADD</span>
          </footer>
        </div>
      </EmojiPickerRoot>
    </section>

    <footer class="site-footer">
      <span>DATA: EMOJIBASE</span>
      <span>VUE 3 · TYPESCRIPT</span>
      <span>MIT LICENSE</span>
    </footer>
  </main>
</template>
