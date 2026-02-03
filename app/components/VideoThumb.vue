<template>
  <div class="relative group">
    <video
      :src="`${completeVideoURL}`"
      class="w-full h-auto rounded-lg"
      @loadeddata="setPreview"
      @play="onPlay"
      @pause="onPause"
      ref="videoRefs"
    ></video>
    <button
      @click="toggleVideo()"
      class="absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-50 transition-all ease-in-out duration-300 text-white text-4xl rounded-lg"
    >
      <div v-if="!playing">▶</div>
      <div v-else>■</div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRuntimeConfig } from "#imports";

const props = defineProps<{
  videoURL: string;
}>();

const config = useRuntimeConfig();
const baseUrl = `http://localhost:${config.public.serverPort}`;
const completeVideoURL = `${baseUrl}/uploads/${props.videoURL}`;
const videoRefs = ref<HTMLVideoElement | null>(null);

const playing = ref(false);

const setPreview = () => {
  if (videoRefs.value) {
    videoRefs.value.currentTime = 10;
  }
};

const toggleVideo = () => {
  if (playing.value) {
    stopVideo();
  } else {
    playVideo();
  }
};

const playVideo = () => {
  videoRefs.value!.currentTime = 0;
  videoRefs.value!.play();
};

const stopVideo = () => {
  videoRefs.value!.pause();
  setPreview();
};

const onPlay = (event: Event) => {
  playing.value = true;
};

const onPause = (event: Event) => {
  playing.value = false;
};

onMounted(() => {
  setPreview();
});
</script>
