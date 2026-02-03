<template>
  <div class="relative w-screen h-screen bg-black">
    <video
      ref="video"
      autoplay
      muted
      playsinline
      class="w-full h-full bg-black"
    ></video>

    <div
      v-if="countDown > 0"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="text-white text-6xl font-bold">{{ countDown }}</div>
    </div>

    <button
      @click="stop"
      class="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Stop
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const videoComposable = useVideo();

const video = ref<HTMLVideoElement | null>(null);
const countDown = ref(3);
let stream: MediaStream | null = null;
let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];
let countdownInterval: NodeJS.Timeout | null = null;

const start = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  if (video.value) {
    video.value.srcObject = stream;
  }

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();
};

const stop = () => {
  if (!recorder || !stream) return;

  recorder.stop();
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    console.log(blob);
    videoComposable.saveVideo(blob);
    chunks = [];
  };

  stream.getTracks().forEach((t) => t.stop());
};

onMounted(() => {
  countdownInterval = setInterval(() => {
    countDown.value--;
    if (countDown.value === 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      start();
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  stream?.getTracks().forEach((t) => t.stop());
});
</script>
