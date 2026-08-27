import {
  computed,
  inject,
  provide,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";
import { getEmojiPickerData } from "./data";
import { loadEmojiData } from "./loader";
import type {
  CustomEmoji,
  Emoji,
  EmojiData,
  EmojiDataEmoji,
  EmojiPickerData,
  SkinTone,
} from "./types";
import type { EmojiDataSource } from "./loader";

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
  setSearch: (search: string) => void;
}

export const emojiPickerKey: InjectionKey<EmojiPickerContext> = Symbol("EmojiPicker");

export function createEmojiPicker(options: {
  locale: ComputedRef<string>;
  columns: ComputedRef<number>;
  sticky: ComputedRef<boolean>;
  skinTone: Ref<SkinTone>;
  searchValue: ComputedRef<string | undefined>;
  recentEmojis: ComputedRef<CustomEmoji[]>;
  customEmojis: ComputedRef<CustomEmoji[]>;
  recentLabel: ComputedRef<string | undefined>;
  customLabel: ComputedRef<string | undefined>;
  emojibaseUrl: ComputedRef<EmojiDataSource>;
  emojiVersion: ComputedRef<number | undefined>;
  onEmojiSelect: (emoji: Emoji) => void;
  onSearchChange: (search: string) => void;
}) {
  const search = ref(options.searchValue.value ?? "");
  const loading = ref(true);
  const error = ref<Error>();
  const data = ref<EmojiData>();
  const englishData = ref<EmojiData>();
  const activeEmoji = ref<Emoji>();
  watch(options.searchValue, (value) => {
    if (value !== undefined) search.value = value;
  });
  const pickerData = computed(() => {
    if (!data.value) return undefined;
    const filtered = options.emojiVersion.value
      ? {
          ...data.value,
          emojis: data.value.emojis.filter((emoji) => emoji.version <= options.emojiVersion.value!),
        }
      : data.value;
    const englishEmojis: EmojiDataEmoji[] = englishData.value?.emojis ?? [];
    return getEmojiPickerData(
      filtered,
      options.columns.value,
      options.skinTone.value,
      search.value,
      {
        englishEmojis,
        recentEmojis: options.recentEmojis.value,
        customEmojis: options.customEmojis.value,
        recentLabel: options.recentLabel.value,
        customLabel: options.customLabel.value,
      },
    );
  });
  let controller: AbortController | undefined;

  const reload = async () => {
    controller?.abort();
    controller = new AbortController();
    loading.value = true;
    error.value = undefined;
    try {
      const locale = options.locale.value;
      const [localized, english] = await Promise.all([
        loadEmojiData(locale, options.emojibaseUrl.value, controller.signal),
        locale === "en"
          ? Promise.resolve(undefined)
          : loadEmojiData("en", options.emojibaseUrl.value, controller.signal),
      ]);
      data.value = localized;
      englishData.value = english;
    } catch (cause) {
      if ((cause as Error).name !== "AbortError")
        error.value = cause instanceof Error ? cause : new Error(String(cause));
    } finally {
      if (!controller.signal.aborted) loading.value = false;
    }
  };

  const setSearch = (value: string) => {
    if (options.searchValue.value === undefined) search.value = value;
    options.onSearchChange(value);
  };
  const context: EmojiPickerContext = {
    ...options,
    search,
    loading,
    error,
    data,
    pickerData,
    activeEmoji,
    select: options.onEmojiSelect,
    setSearch,
  };
  provide(emojiPickerKey, context);
  return { context, reload, setSearch, dispose: () => controller?.abort() };
}

export function useEmojiPicker() {
  const context = inject(emojiPickerKey);
  if (!context)
    throw new Error("Emoji picker components must be rendered inside <EmojiPickerRoot>.");
  return context;
}
