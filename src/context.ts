import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from "vue";
import { getEmojiPickerData } from "./data";
import { loadEmojiData } from "./loader";
import type { Emoji, EmojiData, EmojiPickerData, SkinTone } from "./types";

export interface EmojiPickerContext {
  columns: ComputedRef<number>;
  sticky: ComputedRef<boolean>;
  skinTone: Ref<SkinTone>;
  search: Ref<string>;
  loading: Ref<boolean>;
  error: Ref<Error | undefined>;
  data: Ref<EmojiData | undefined>;
  pickerData: ComputedRef<EmojiPickerData | undefined>;
  activeEmoji: Ref<Emoji | undefined>;
  select: (emoji: Emoji) => void;
}

export const emojiPickerKey: InjectionKey<EmojiPickerContext> = Symbol("EmojiPicker");

export function createEmojiPicker(options: {
  locale: ComputedRef<string>;
  columns: ComputedRef<number>;
  sticky: ComputedRef<boolean>;
  skinTone: Ref<SkinTone>;
  emojibaseUrl: ComputedRef<string>;
  emojiVersion: ComputedRef<number | undefined>;
  onEmojiSelect: (emoji: Emoji) => void;
}) {
  const search = ref("");
  const loading = ref(true);
  const error = ref<Error>();
  const data = ref<EmojiData>();
  const activeEmoji = ref<Emoji>();
  const pickerData = computed(() => {
    if (!data.value) return undefined;
    const filtered = options.emojiVersion.value
      ? { ...data.value, emojis: data.value.emojis.filter((emoji) => emoji.version <= options.emojiVersion.value!) }
      : data.value;
    return getEmojiPickerData(filtered, options.columns.value, options.skinTone.value, search.value);
  });
  let controller: AbortController | undefined;

  const reload = async () => {
    controller?.abort();
    controller = new AbortController();
    loading.value = true;
    error.value = undefined;
    try {
      data.value = await loadEmojiData(options.locale.value, options.emojibaseUrl.value, controller.signal);
    } catch (cause) {
      if ((cause as Error).name !== "AbortError") error.value = cause instanceof Error ? cause : new Error(String(cause));
    } finally {
      if (!controller.signal.aborted) loading.value = false;
    }
  };

  const context: EmojiPickerContext = { ...options, search, loading, error, data, pickerData, activeEmoji, select: options.onEmojiSelect };
  provide(emojiPickerKey, context);
  return { context, reload, dispose: () => controller?.abort() };
}

export function useEmojiPicker() {
  const context = inject(emojiPickerKey);
  if (!context) throw new Error("Emoji picker components must be rendered inside <EmojiPickerRoot>.");
  return context;
}
