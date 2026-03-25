<template>
  <section class="mx-auto w-full flex-1">
    <div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-xl font-semibold text-white">Background image</h2>
        <p class="mt-2 text-sm text-slate-300">
          Upload a single image to show behind the welcome screen on the
          home page. This is saved in this browser only using local storage.
        </p>

        <label
          :class="[
            'mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition',
            isDraggingBackground
              ? 'border-emerald-200 bg-emerald-300/20'
              : 'border-emerald-300/40 bg-emerald-400/10 hover:border-emerald-300/70 hover:bg-emerald-400/15',
          ]"
          @dragenter.prevent="isDraggingBackground = true"
          @dragover.prevent="isDraggingBackground = true"
          @dragleave.prevent="isDraggingBackground = false"
          @drop.prevent="onBackgroundDrop"
        >
          <span class="text-base font-medium text-white">Choose image</span>
          <span class="mt-2 text-sm text-slate-300">
            Drop an image here or click to browse. PNG, JPG, or WEBP only.
          </span>
          <input
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            type="file"
            @change="onBackgroundSelect"
          />
        </label>

        <p v-if="backgroundMessage" class="mt-4 text-sm text-emerald-300">
          {{ backgroundMessage }}
        </p>

        <button
          v-if="backgroundImage"
          class="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          @click="removeBackground"
        >
          Remove background image
        </button>

        <div class="mt-8 border-t border-white/10 pt-6">
          <h3 class="text-lg font-semibold text-white">Welcome text</h3>
          <p class="mt-2 text-sm text-slate-300">
            Edit the title and subtitle shown on the home screen.
          </p>

          <label class="mt-5 block">
            <span class="text-sm font-medium text-slate-200">Title</span>
            <input
              v-model="welcomeTitle"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60"
              placeholder="Welcome to the Wedding Guest Greeting Recorder"
              type="text"
              @input="saveWelcomeText"
            />
          </label>

          <label class="mt-4 block">
            <span class="text-sm font-medium text-slate-200">Subtitle</span>
            <textarea
              v-model="welcomeSubtitle"
              class="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60"
              placeholder="Record and save your wedding guest greetings!"
              @input="saveWelcomeText"
            />
          </label>

          <label class="mt-4 block">
            <span class="text-sm font-medium text-slate-200">Alignment</span>
            <select
              v-model="heroTextStyle.contentAlign"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-300/60"
              @change="saveHeroTextStyle"
            >
              <option
                v-for="alignment in alignmentOptions"
                :key="alignment.value"
                :value="alignment.value"
              >
                {{ alignment.label }}
              </option>
            </select>
          </label>

          <label class="mt-4 block">
            <span class="text-sm font-medium text-slate-200">Primary button color</span>
            <input
              v-model="heroTextStyle.primaryButtonColor"
              class="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 p-1"
              type="color"
              @input="saveHeroTextStyle"
            />
          </label>

          <label class="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <input
              v-model="heroTextStyle.useGlassEffect"
              class="h-4 w-4 rounded border-white/20 bg-slate-950/70 accent-emerald-300"
              type="checkbox"
              @change="saveHeroTextStyle"
            />
            <span class="text-sm text-slate-200">Use glass effect on content container</span>
          </label>

          <div class="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-slate-100">Device fonts</p>
                <p class="mt-1 text-xs text-slate-400">
                  Load installed fonts from this device for the font selectors.
                </p>
              </div>
              <button
                class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isLoadingDeviceFonts || !deviceFontsSupported"
                @click="loadDeviceFonts"
              >
                {{ isLoadingDeviceFonts ? 'Loading fonts...' : 'Load device fonts' }}
              </button>
            </div>
            <p class="mt-3 text-xs text-slate-400">
              {{
                deviceFontsMessage ||
                (deviceFontsSupported
                  ? 'Supported in Chromium-based browsers with local font access.'
                  : 'This browser does not expose installed device fonts.')
              }}
            </p>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p class="text-sm font-medium text-slate-100">Title style</p>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Size</span>
                <input
                  v-model="heroTextStyle.titleFontSize"
                  class="mt-2 w-full accent-emerald-300"
                  min="24"
                  max="96"
                  type="range"
                  @input="saveHeroTextStyle"
                />
                <span class="mt-1 block text-sm text-slate-300">
                  {{ heroTextStyle.titleFontSize }}px
                </span>
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Color</span>
                <input
                  v-model="heroTextStyle.titleColor"
                  class="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 p-1"
                  type="color"
                  @input="saveHeroTextStyle"
                />
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Font</span>
                <select
                  v-model="heroTextStyle.titleFontFamily"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-300/60"
                  @change="saveHeroTextStyle"
                >
                  <option
                    v-for="font in fontOptions"
                    :key="font.value"
                    :value="font.value"
                  >
                    {{ font.label }}
                  </option>
                </select>
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Weight</span>
                <select
                  v-model="heroTextStyle.titleFontWeight"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-300/60"
                  @change="saveHeroTextStyle"
                >
                  <option
                    v-for="weight in fontWeightOptions"
                    :key="`title-${weight.value}`"
                    :value="weight.value"
                  >
                    {{ weight.label }}
                  </option>
                </select>
              </label>
            </div>

            <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p class="text-sm font-medium text-slate-100">Subtitle style</p>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Size</span>
                <input
                  v-model="heroTextStyle.subtitleFontSize"
                  class="mt-2 w-full accent-emerald-300"
                  min="12"
                  max="48"
                  type="range"
                  @input="saveHeroTextStyle"
                />
                <span class="mt-1 block text-sm text-slate-300">
                  {{ heroTextStyle.subtitleFontSize }}px
                </span>
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Color</span>
                <input
                  v-model="heroTextStyle.subtitleColor"
                  class="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 p-1"
                  type="color"
                  @input="saveHeroTextStyle"
                />
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Font</span>
                <select
                  v-model="heroTextStyle.subtitleFontFamily"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-300/60"
                  @change="saveHeroTextStyle"
                >
                  <option
                    v-for="font in fontOptions"
                    :key="`subtitle-${font.value}`"
                    :value="font.value"
                  >
                    {{ font.label }}
                  </option>
                </select>
              </label>

              <label class="mt-4 block">
                <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Weight</span>
                <select
                  v-model="heroTextStyle.subtitleFontWeight"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-300/60"
                  @change="saveHeroTextStyle"
                >
                  <option
                    v-for="weight in fontWeightOptions"
                    :key="`subtitle-${weight.value}`"
                    :value="weight.value"
                  >
                    {{ weight.label }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <p
            class="text-sm font-medium uppercase tracking-[0.3em] text-slate-400"
          >
            Preview
          </p>
          <button
            class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/10"
            @click="resetHeroLayout"
          >
            Reset layout
          </button>
        </div>
        <div
          ref="previewFrame"
          :style="{ aspectRatio: previewAspectRatio }"
          class="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
        >
          <div :style="scaledStageStyle" class="absolute left-0 top-0 origin-top-left">
            <div
              :style="virtualStageStyle"
              class="relative overflow-hidden bg-slate-950"
            >
              <div
                v-if="backgroundImage"
                :style="{ backgroundImage: `url(${backgroundImage})` }"
                class="absolute inset-0 bg-cover bg-center"
              />
              <div
                class="absolute inset-0"
                :class="
                  backgroundImage
                    ? 'bg-black/45'
                    : 'bg-[radial-gradient(circle_at_top,#334155,#020617_65%)]'
                "
              />

              <div
                :style="heroLayoutStyle"
                class="absolute z-10 flex cursor-move touch-none select-none rounded-3xl border-2 border-dashed border-emerald-300/70 text-center shadow-[0_0_0_1px_rgba(15,23,42,0.35)]"
                @pointerdown="startDragging"
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
                />

                <button
                  class="absolute bottom-2 right-2 h-5 w-5 rounded-full border border-white/30 bg-emerald-300/80"
                  @pointerdown.stop="startResizing"
                />
              </div>
            </div>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-400">
          Drag the overlay to reposition it. Drag the green handle to resize it.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const BACKGROUND_STORAGE_KEY = 'wedding-greeting-background-image';
const WELCOME_TITLE_STORAGE_KEY = 'wedding-greeting-welcome-title';
const WELCOME_SUBTITLE_STORAGE_KEY = 'wedding-greeting-welcome-subtitle';
const HERO_TEXT_STYLE_STORAGE_KEY = 'wedding-greeting-hero-text-style';
const HERO_LAYOUT_STORAGE_KEY = 'wedding-greeting-hero-layout';
const DEFAULT_WELCOME_TITLE = 'Welcome to the Wedding Guest Greeting Recorder';
const DEFAULT_WELCOME_SUBTITLE =
  'Record and save your wedding guest greetings!';
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
const backgroundMessage = ref('');
const isDraggingBackground = ref(false);
const welcomeTitle = ref(DEFAULT_WELCOME_TITLE);
const welcomeSubtitle = ref(DEFAULT_WELCOME_SUBTITLE);
const heroTextStyle = reactive<HeroTextStyle>({ ...DEFAULT_HERO_TEXT_STYLE });
const previewFrame = ref<HTMLDivElement | null>(null);
const previewAspectRatio = ref('9 / 16');
const previewScale = ref(1);
const heroLayout = reactive({ ...DEFAULT_HERO_LAYOUT });
const defaultFontOptions = [
  { label: 'Default', value: 'inherit' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times', value: '"Times New Roman", serif' },
  { label: 'Trebuchet', value: '"Trebuchet MS", sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier', value: '"Courier New", monospace' }
] as const;
const fontOptions = ref<FontOption[]>(
  defaultFontOptions.map((font) => ({ ...font }))
);
const fontWeightOptions = [
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semibold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Extra Bold', value: 800 }
] as const;
const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
] as const;
const deviceFontsSupported = ref(false);
const isLoadingDeviceFonts = ref(false);
const deviceFontsMessage = ref('');

type LocalFontData = {
  family?: string;
  fullName?: string;
};

type FontOption = {
  label: string;
  value: string;
};

type WindowWithLocalFonts = Window & {
  queryLocalFonts?: () => Promise<LocalFontData[]>;
};

let activePointerMode: 'drag' | 'resize' | null = null;
let pointerStartX = 0;
let pointerStartY = 0;
let layoutStartX = 0;
let layoutStartY = 0;
let layoutStartWidth = 0;
let layoutStartHeight = 0;

const heroLayoutStyle = computed(() => ({
  left: `${heroLayout.x}%`,
  top: `${heroLayout.y}%`,
  width: `${heroLayout.width}%`,
  height: `${heroLayout.height}%`
}));

const virtualStageStyle = computed(() => ({
  width: `${windowSize.width}px`,
  height: `${windowSize.height}px`
}));

const scaledStageStyle = computed(() => ({
  width: `${windowSize.width}px`,
  height: `${windowSize.height}px`,
  transform: `scale(${previewScale.value})`
}));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getStoredNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const syncFontOptions = (deviceFonts: string[] = []) => {
  const seen = new Set<string>();
  const merged = [
    ...defaultFontOptions.map((font) => ({ label: font.label, value: font.value })),
    ...deviceFonts.map((font) => ({ label: font, value: `"${font}"` }))
  ].filter((font) => {
    if (seen.has(font.value)) {
      return false;
    }

    seen.add(font.value);
    return true;
  });

  const ensureCurrentFont = (fontValue: string) => {
    if (!fontValue || seen.has(fontValue)) {
      return;
    }

    merged.push({
      label: fontValue.replaceAll('"', ''),
      value: fontValue
    });
    seen.add(fontValue);
  };

  ensureCurrentFont(heroTextStyle.titleFontFamily);
  ensureCurrentFont(heroTextStyle.subtitleFontFamily);

  fontOptions.value = merged;
};

const windowSize = reactive({
  width: 390,
  height: 844
});

const loadDeviceFonts = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const localFontWindow = window as WindowWithLocalFonts;

  if (!localFontWindow.queryLocalFonts) {
    deviceFontsMessage.value =
      'Installed device fonts are not available in this browser.';
    return;
  }

  isLoadingDeviceFonts.value = true;
  deviceFontsMessage.value = '';

  try {
    const fonts = await localFontWindow.queryLocalFonts();
    const families = [...new Set(
      fonts
        .map((font) => font.family?.trim() || font.fullName?.trim() || '')
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    syncFontOptions(families);
    deviceFontsMessage.value =
      families.length > 0
        ? `${families.length} device fonts loaded.`
        : 'No installed device fonts were returned.';
  } catch {
    deviceFontsMessage.value =
      'Device font access was denied or is unavailable.';
  } finally {
    isLoadingDeviceFonts.value = false;
  }
};

const updatePreviewAspectRatio = () => {
  if (typeof window === 'undefined' || !window.innerWidth || !window.innerHeight) {
    return;
  }

  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;
  previewAspectRatio.value = `${window.innerWidth} / ${window.innerHeight}`;
  updatePreviewScale();
};

const updatePreviewScale = () => {
  if (!previewFrame.value || !windowSize.width || !windowSize.height) {
    return;
  }

  const widthScale = previewFrame.value.clientWidth / windowSize.width;
  const heightScale = previewFrame.value.clientHeight / windowSize.height;

  previewScale.value = Math.min(widthScale, heightScale);
};

const saveHeroLayout = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    HERO_LAYOUT_STORAGE_KEY,
    JSON.stringify(heroLayout)
  );
};

const loadHeroLayout = () => {
  if (typeof window === 'undefined') {
    return;
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
  } catch {
    heroLayout.x = DEFAULT_HERO_LAYOUT.x;
    heroLayout.y = DEFAULT_HERO_LAYOUT.y;
    heroLayout.width = DEFAULT_HERO_LAYOUT.width;
    heroLayout.height = DEFAULT_HERO_LAYOUT.height;
  }
};

const loadConfiguration = () => {
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

  loadHeroLayout();
};

const saveWelcomeText = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    WELCOME_TITLE_STORAGE_KEY,
    welcomeTitle.value || DEFAULT_WELCOME_TITLE
  );
  window.localStorage.setItem(
    WELCOME_SUBTITLE_STORAGE_KEY,
    welcomeSubtitle.value || DEFAULT_WELCOME_SUBTITLE
  );
};

const saveHeroTextStyle = () => {
  if (typeof window === 'undefined') {
    return;
  }

  heroTextStyle.titleFontSize = clamp(heroTextStyle.titleFontSize, 24, 96);
  heroTextStyle.subtitleFontSize = clamp(heroTextStyle.subtitleFontSize, 12, 48);
  heroTextStyle.titleFontWeight = getStoredNumber(
    heroTextStyle.titleFontWeight,
    DEFAULT_HERO_TEXT_STYLE.titleFontWeight
  );
  heroTextStyle.subtitleFontWeight = getStoredNumber(
    heroTextStyle.subtitleFontWeight,
    DEFAULT_HERO_TEXT_STYLE.subtitleFontWeight
  );
  heroTextStyle.contentAlign =
    heroTextStyle.contentAlign === 'center' ||
    heroTextStyle.contentAlign === 'right'
      ? heroTextStyle.contentAlign
      : DEFAULT_HERO_TEXT_STYLE.contentAlign;
  heroTextStyle.primaryButtonColor =
    typeof heroTextStyle.primaryButtonColor === 'string'
      ? heroTextStyle.primaryButtonColor
      : DEFAULT_HERO_TEXT_STYLE.primaryButtonColor;
  heroTextStyle.useGlassEffect = Boolean(heroTextStyle.useGlassEffect);

  window.localStorage.setItem(
    HERO_TEXT_STYLE_STORAGE_KEY,
    JSON.stringify(heroTextStyle)
  );
};

const saveBackgroundFile = (file: File | null | undefined) => {
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    backgroundMessage.value = 'Please drop or select a valid image file.';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : null;

    if (!result || typeof window === 'undefined') {
      backgroundMessage.value = 'Unable to save the selected image.';
      return;
    }

    try {
      window.localStorage.setItem(BACKGROUND_STORAGE_KEY, result);
      backgroundImage.value = result;
      backgroundMessage.value = 'Background image saved for this browser.';
    } catch {
      backgroundMessage.value =
        'This image is too large to save in local storage.';
    }
  };

  reader.readAsDataURL(file);
};

const onBackgroundSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  saveBackgroundFile(file);
  input.value = '';
};

const onBackgroundDrop = (event: DragEvent) => {
  isDraggingBackground.value = false;
  saveBackgroundFile(event.dataTransfer?.files?.[0]);
};

const removeBackground = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(BACKGROUND_STORAGE_KEY);
  backgroundImage.value = null;
  backgroundMessage.value = 'Background image removed.';
};

const resetHeroLayout = () => {
  heroLayout.x = DEFAULT_HERO_LAYOUT.x;
  heroLayout.y = DEFAULT_HERO_LAYOUT.y;
  heroLayout.width = DEFAULT_HERO_LAYOUT.width;
  heroLayout.height = DEFAULT_HERO_LAYOUT.height;
  saveHeroLayout();
};

const stopPointerInteraction = () => {
  activePointerMode = null;
};

const updateHeroLayoutFromPointer = (event: PointerEvent) => {
  if (!activePointerMode || !previewFrame.value) {
    return;
  }

  const frameWidth = previewFrame.value.clientWidth;
  const frameHeight = previewFrame.value.clientHeight;

  if (!frameWidth || !frameHeight) {
    return;
  }

  const deltaXPercent = ((event.clientX - pointerStartX) / frameWidth) * 100;
  const deltaYPercent = ((event.clientY - pointerStartY) / frameHeight) * 100;

  if (activePointerMode === 'drag') {
    heroLayout.x = clamp(layoutStartX + deltaXPercent, 0, 100 - heroLayout.width);
    heroLayout.y = clamp(layoutStartY + deltaYPercent, 0, 100 - heroLayout.height);
  }

  if (activePointerMode === 'resize') {
    heroLayout.width = clamp(
      layoutStartWidth + deltaXPercent,
      MIN_HERO_WIDTH,
      100 - layoutStartX
    );
    heroLayout.height = clamp(
      layoutStartHeight + deltaYPercent,
      MIN_HERO_HEIGHT,
      100 - layoutStartY
    );
  }

  updatePreviewScale();
  saveHeroLayout();
};

const startDragging = (event: PointerEvent) => {
  activePointerMode = 'drag';
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  layoutStartX = heroLayout.x;
  layoutStartY = heroLayout.y;
};

const startResizing = (event: PointerEvent) => {
  activePointerMode = 'resize';
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  layoutStartX = heroLayout.x;
  layoutStartY = heroLayout.y;
  layoutStartWidth = heroLayout.width;
  layoutStartHeight = heroLayout.height;
};

onMounted(() => {
  loadConfiguration();
  syncFontOptions();
  deviceFontsSupported.value =
    typeof window !== 'undefined' &&
    typeof (window as WindowWithLocalFonts).queryLocalFonts === 'function';
  updatePreviewAspectRatio();
  window.addEventListener('resize', updatePreviewAspectRatio);
  window.addEventListener('pointermove', updateHeroLayoutFromPointer);
  window.addEventListener('pointerup', stopPointerInteraction);
  nextTick(() => {
    updatePreviewScale();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePreviewAspectRatio);
  window.removeEventListener('pointermove', updateHeroLayoutFromPointer);
  window.removeEventListener('pointerup', stopPointerInteraction);
});
</script>
