<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div
      class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6"
    >
      <div
        class="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-emerald-300/80">
            Video Greetings Admin
          </p>
          <h1 class="mt-2 text-3xl font-semibold text-white">
            Media Control Room
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-300">
            Review recorded greetings or upload a background image for the
            welcome screen.
          </p>
        </div>

        <nav class="flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            v-for="item in navItems"
            :key="item"
            :class="[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              activeTab === item
                ? 'bg-emerald-400 text-slate-950'
                : 'text-slate-300 hover:bg-white/5 hover:text-white',
            ]"
            @click="activeTab = item"
          >
            {{ item }}
          </button>
        </nav>
      </div>

      <section v-if="activeTab === 'Videos'" class="flex-1">
        <div
          v-if="videos.length === 0"
          class="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 text-center"
        >
          <p class="text-lg text-white">There are no videos saved yet.</p>
          <p class="mt-2 text-sm text-slate-400">
            Once guests record a greeting, it will appear here.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"
        >
          <VideoThumb v-for="video in videos" :key="video" :videoURL="video" />
        </div>
      </section>

      <section v-else class="mx-auto w-full max-w-4xl flex-1">
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
          </div>

          <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <p
              class="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-slate-400"
            >
              Preview
            </p>
            <div
              class="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
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
                    ? 'bg-black/35'
                    : 'bg-[radial-gradient(circle_at_top,#1e293b,#020617_65%)]'
                "
              />

              <div
                class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
              >
                <h3 class="text-2xl font-semibold text-white">
                  Welcome to the Wedding Guest Greeting Recorder
                </h3>
                <p class="mt-3 text-sm text-slate-200">
                  Record and save your wedding guest greetings!
                </p>
                <span
                  class="mt-6 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Record Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVideo } from "~/composables/video.composable";

const BACKGROUND_STORAGE_KEY = "wedding-greeting-background-image";

const navItems = ["Videos", "Background image"] as const;

const activeTab = ref<(typeof navItems)[number]>("Videos");
const backgroundImage = ref<string | null>(null);
const backgroundMessage = ref("");
const isDraggingBackground = ref(false);

const { videos, fetchVideos } = useVideo();

const loadBackground = () => {
  if (typeof window === "undefined") {
    return;
  }

  backgroundImage.value = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
};

const saveBackgroundFile = (file: File | null | undefined) => {
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    backgroundMessage.value = "Please drop or select a valid image file.";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const result = typeof reader.result === "string" ? reader.result : null;

    if (!result || typeof window === "undefined") {
      backgroundMessage.value = "Unable to save the selected image.";
      return;
    }

    try {
      window.localStorage.setItem(BACKGROUND_STORAGE_KEY, result);
      backgroundImage.value = result;
      backgroundMessage.value = "Background image saved for this browser.";
    } catch {
      backgroundMessage.value =
        "This image is too large to save in local storage.";
    }
  };

  reader.readAsDataURL(file);
};

const onBackgroundSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  saveBackgroundFile(file);
  input.value = "";
};

const onBackgroundDrop = (event: DragEvent) => {
  isDraggingBackground.value = false;
  saveBackgroundFile(event.dataTransfer?.files?.[0]);
};

const removeBackground = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(BACKGROUND_STORAGE_KEY);
  backgroundImage.value = null;
  backgroundMessage.value = "Background image removed.";
};

onMounted(() => {
  fetchVideos();
  loadBackground();
});
</script>
