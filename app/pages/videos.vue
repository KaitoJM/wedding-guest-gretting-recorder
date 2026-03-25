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

      <SavedVideoList v-if="activeTab === 'Videos'" :videos="videos" />
      <HomeScreenConfigurator v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVideo } from '~/composables/video.composable';

const navItems = ['Videos', 'Background image'] as const;

const activeTab = ref<(typeof navItems)[number]>('Videos');

const { videos, fetchVideos } = useVideo();

onMounted(() => {
  fetchVideos();
});
</script>
