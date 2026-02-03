<template>
  <div class="relative w-screen h-screen bg-black">
    <video
      ref="video"
      autoplay
      muted
      playsinline
      class="w-full h-full bg-black"
    ></video>

    <button
      @click="start"
      class="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Start
    </button>
    <button
      @click="stop"
      class="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Stop
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from "vue";

const video = ref<HTMLVideoElement | null>(null);
const videoComposable = useVideo();

let stream: MediaStream | null = null;
let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];

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

onUnmounted(() => {
  stream?.getTracks().forEach((t) => t.stop());
});
</script>
