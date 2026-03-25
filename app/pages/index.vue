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
        :use-links="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const BACKGROUND_STORAGE_KEY = 'wedding-greeting-background-image';
const WELCOME_TITLE_STORAGE_KEY = 'wedding-greeting-welcome-title';
const WELCOME_SUBTITLE_STORAGE_KEY = 'wedding-greeting-welcome-subtitle';
const HERO_LAYOUT_STORAGE_KEY = 'wedding-greeting-hero-layout';
const DEFAULT_WELCOME_TITLE = 'Welcome to the Wedding Guest Greeting Recorder';
const DEFAULT_WELCOME_SUBTITLE = 'Record and save your wedding guest greetings!';
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
