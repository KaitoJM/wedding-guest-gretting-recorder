<template>
  <div
    v-if="videos.length === 0"
    class="w-screen h-screen flex flex-col items-center justify-center"
  >
    <p>There are no videos saved yet.</p>
  </div>
  <div
    v-else
    class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-4"
  >
    <VideoThumb v-for="video in videos" :key="video" :videoURL="video" />
  </div>
</template>

<script lang="ts" setup>
import videoService from "~/services/video.service";
import { useRuntimeConfig } from "#imports";

const videos = ref<string[]>([]);

const getVideos = async () => {
  const data = await videoService.getVideos();
  videos.value = data.videos.filter((v) => !v.includes(".DS_Store"));
  return videos;
};

onMounted(() => {
  getVideos();
});
</script>
