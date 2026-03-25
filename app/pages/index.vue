<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950">
    <div
      v-if="backgroundImage"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      class="absolute inset-0 bg-cover bg-center"
    />
    <div
      class="absolute inset-0"
      :class="backgroundImage ? 'bg-black/45' : 'bg-[radial-gradient(circle_at_top,#334155,#020617_65%)]'"
    />

    <div
      :style="heroLayoutStyle"
      class="absolute z-10 flex text-center"
    >
      <HomeScreenHeroContent
        :title="welcomeTitle"
        :subtitle="welcomeSubtitle"
        :title-font-size="heroTextStyle.titleFontSize"
        :title-color="heroTextStyle.titleColor"
        :title-font-family="heroTextStyle.titleFontFamily"
        :title-font-weight="heroTextStyle.titleFontWeight"
        :subtitle-font-size="heroTextStyle.subtitleFontSize"
        :subtitle-color="heroTextStyle.subtitleColor"
        :subtitle-font-family="heroTextStyle.subtitleFontFamily"
        :subtitle-font-weight="heroTextStyle.subtitleFontWeight"
        :content-align="heroTextStyle.contentAlign"
        :primary-button-color="heroTextStyle.primaryButtonColor"
        :use-glass-effect="heroTextStyle.useGlassEffect"
        :use-links="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const BACKGROUND_STORAGE_KEY = 'wedding-greeting-background-image';
const WELCOME_TITLE_STORAGE_KEY = 'wedding-greeting-welcome-title';
const WELCOME_SUBTITLE_STORAGE_KEY = 'wedding-greeting-welcome-subtitle';
const HERO_TEXT_STYLE_STORAGE_KEY = 'wedding-greeting-hero-text-style';
const HERO_LAYOUT_STORAGE_KEY = 'wedding-greeting-hero-layout';
const DEFAULT_WELCOME_TITLE = 'Welcome to the Wedding Guest Greeting Recorder';
const DEFAULT_WELCOME_SUBTITLE = 'Record and save your wedding guest greetings!';
type ContentAlign = 'left' | 'center' | 'right';

type HeroTextStyle = {
  titleFontSize: number;
  titleColor: string;
  titleFontFamily: string;
  titleFontWeight: number;
  subtitleFontSize: number;
  subtitleColor: string;
  subtitleFontFamily: string;
  subtitleFontWeight: number;
  contentAlign: ContentAlign;
  primaryButtonColor: string;
  useGlassEffect: boolean;
};

const DEFAULT_HERO_TEXT_STYLE: HeroTextStyle = {
  titleFontSize: 48,
  titleColor: '#ffffff',
  titleFontFamily: 'inherit',
  titleFontWeight: 700,
  subtitleFontSize: 18,
  subtitleColor: '#e2e8f0',
  subtitleFontFamily: 'inherit',
  subtitleFontWeight: 400,
  contentAlign: 'left',
  primaryButtonColor: '#f43f5e',
  useGlassEffect: true
};
const DEFAULT_HERO_LAYOUT = {
  x: 15,
  y: 28,
  width: 42,
  height: 24
};
const MIN_HERO_WIDTH = 18;
const MIN_HERO_HEIGHT = 12;

const backgroundImage = ref<string | null>(null);
const welcomeTitle = ref(DEFAULT_WELCOME_TITLE);
const welcomeSubtitle = ref(DEFAULT_WELCOME_SUBTITLE);
const heroLayout = reactive({ ...DEFAULT_HERO_LAYOUT });
const heroTextStyle = reactive<HeroTextStyle>({ ...DEFAULT_HERO_TEXT_STYLE });

const heroLayoutStyle = computed(() => ({
  left: `${heroLayout.x}%`,
  top: `${heroLayout.y}%`,
  width: `${heroLayout.width}%`,
  height: `${heroLayout.height}%`
}));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getStoredNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

onMounted(() => {
  if (typeof window === 'undefined') {
    return;
  }

  backgroundImage.value = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
  welcomeTitle.value =
    window.localStorage.getItem(WELCOME_TITLE_STORAGE_KEY) ||
    DEFAULT_WELCOME_TITLE;
  welcomeSubtitle.value =
    window.localStorage.getItem(WELCOME_SUBTITLE_STORAGE_KEY) ||
    DEFAULT_WELCOME_SUBTITLE;
  const savedTextStyle = window.localStorage.getItem(HERO_TEXT_STYLE_STORAGE_KEY);

  if (savedTextStyle) {
    try {
      const parsedTextStyle = JSON.parse(savedTextStyle);

      heroTextStyle.titleFontSize = clamp(
        getStoredNumber(
          parsedTextStyle.titleFontSize,
          DEFAULT_HERO_TEXT_STYLE.titleFontSize
        ),
        24,
        96
      );
      heroTextStyle.titleColor =
        typeof parsedTextStyle.titleColor === 'string'
          ? parsedTextStyle.titleColor
          : DEFAULT_HERO_TEXT_STYLE.titleColor;
      heroTextStyle.titleFontFamily =
        typeof parsedTextStyle.titleFontFamily === 'string'
          ? parsedTextStyle.titleFontFamily
          : DEFAULT_HERO_TEXT_STYLE.titleFontFamily;
      heroTextStyle.titleFontWeight = getStoredNumber(
        parsedTextStyle.titleFontWeight,
        DEFAULT_HERO_TEXT_STYLE.titleFontWeight
      );
      heroTextStyle.subtitleFontSize = clamp(
        getStoredNumber(
          parsedTextStyle.subtitleFontSize,
          DEFAULT_HERO_TEXT_STYLE.subtitleFontSize
        ),
        12,
        48
      );
      heroTextStyle.subtitleColor =
        typeof parsedTextStyle.subtitleColor === 'string'
          ? parsedTextStyle.subtitleColor
          : DEFAULT_HERO_TEXT_STYLE.subtitleColor;
      heroTextStyle.subtitleFontFamily =
        typeof parsedTextStyle.subtitleFontFamily === 'string'
          ? parsedTextStyle.subtitleFontFamily
          : DEFAULT_HERO_TEXT_STYLE.subtitleFontFamily;
      heroTextStyle.subtitleFontWeight = getStoredNumber(
        parsedTextStyle.subtitleFontWeight,
        DEFAULT_HERO_TEXT_STYLE.subtitleFontWeight
      );
      heroTextStyle.contentAlign =
        parsedTextStyle.contentAlign === 'center' ||
        parsedTextStyle.contentAlign === 'right'
          ? parsedTextStyle.contentAlign
          : DEFAULT_HERO_TEXT_STYLE.contentAlign;
      heroTextStyle.primaryButtonColor =
        typeof parsedTextStyle.primaryButtonColor === 'string'
          ? parsedTextStyle.primaryButtonColor
          : DEFAULT_HERO_TEXT_STYLE.primaryButtonColor;
      heroTextStyle.useGlassEffect =
        typeof parsedTextStyle.useGlassEffect === 'boolean'
          ? parsedTextStyle.useGlassEffect
          : DEFAULT_HERO_TEXT_STYLE.useGlassEffect;
    } catch {}
  }

  const savedLayout = window.localStorage.getItem(HERO_LAYOUT_STORAGE_KEY);

  if (!savedLayout) {
    return;
  }

  try {
    const parsed = JSON.parse(savedLayout);

    heroLayout.x = clamp(getStoredNumber(parsed.x, DEFAULT_HERO_LAYOUT.x), 0, 100);
    heroLayout.y = clamp(getStoredNumber(parsed.y, DEFAULT_HERO_LAYOUT.y), 0, 100);
    heroLayout.width = clamp(
      getStoredNumber(parsed.width, DEFAULT_HERO_LAYOUT.width),
      MIN_HERO_WIDTH,
      100
    );
    heroLayout.height = clamp(
      getStoredNumber(parsed.height, DEFAULT_HERO_LAYOUT.height),
      MIN_HERO_HEIGHT,
      100
    );
    heroLayout.x = clamp(heroLayout.x, 0, 100 - heroLayout.width);
    heroLayout.y = clamp(heroLayout.y, 0, 100 - heroLayout.height);
  } catch {}
});
</script>
