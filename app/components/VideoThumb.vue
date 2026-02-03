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
      <div
        class="flex items-center justify-center border-white border-2 w-20 h-20 rounded-full"
      >
        <div v-if="!playing">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-play-icon lucide-play size-10"
          >
            <path
              d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
            />
          </svg>
        </div>
        <div v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-square-icon lucide-square size-10"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
          </svg>
        </div>
      </div>
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
