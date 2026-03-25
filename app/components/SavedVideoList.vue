<template>
  <section class="flex-1">
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
</template>

<script lang="ts" setup>
defineProps<{
  videos: string[];
}>();
</script>
