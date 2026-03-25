<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950">
    <div
      v-if="!start && backgroundImage"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      class="absolute inset-0 bg-cover bg-center"
    />
    <div
      v-if="!start"
      class="absolute inset-0"
      :class="
        backgroundImage
          ? 'bg-black/45'
          : 'bg-[radial-gradient(circle_at_top,#334155,#020617_65%)]'
      "
    />

    <div
      v-if="!start"
      class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <div
        class="max-w-2xl w-full rounded-3xl border border-white/10 bg-white/10 px-10 py-10 backdrop-blur-md"
      >
        <p class="text-sm uppercase tracking-[0.35em] text-emerald-300/80">
          Recording Booth
        </p>
        <h1 class="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Leave your greeting
        </h1>
        <p class="mt-4 text-base text-slate-200">
          You will be given 1 minute to record your greeting.
        </p>
        <p class="mt-2 text-sm text-slate-300">
          If you are already prepared, click the Start Recording button below.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            :style="{ backgroundColor: primaryButtonColor }"
            class="rounded-full px-6 py-3 text-white transition"
            @click="start = true"
          >
            Start Recording
          </button>
          <button
            class="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white transition hover:bg-white/15"
            @click="$router.push('/')"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>

    <VideoMonitor v-else />
  </div>
</template>

<script lang="ts" setup>
import {
  BACKGROUND_STORAGE_KEY,
  DEFAULT_HERO_TEXT_STYLE,
  HERO_TEXT_STYLE_STORAGE_KEY,
  initHomeScreenConfigStorage,
} from "~/utils/home-screen-config";

const start = ref(false);
const backgroundImage = ref<string | null>(null);
const primaryButtonColor = ref("#f43f5e");

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  initHomeScreenConfigStorage();
  backgroundImage.value = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
  const savedTextStyle = window.localStorage.getItem(
    HERO_TEXT_STYLE_STORAGE_KEY,
  );

  if (savedTextStyle) {
    try {
      const parsedTextStyle = JSON.parse(savedTextStyle);

      primaryButtonColor.value =
        typeof parsedTextStyle.primaryButtonColor === "string"
          ? parsedTextStyle.primaryButtonColor
          : DEFAULT_HERO_TEXT_STYLE.primaryButtonColor;
    } catch {}
  }
});
</script>
