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
      class="absolute inset-0 flex items-center justify-center bg-black opacity-90 backdrop-blur-xl"
    >
      <div class="text-white text-[10rem] font-bold">{{ countDown }}</div>
    </div>

    <div
      v-if="countDown === 0"
      class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded"
    >
      {{ formattedTime }}
    </div>

    <button
      @click="cancelRecord"
      class="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Cancel
    </button>

    <div
      v-if="done"
      class="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black opacity-90 backdrop-blur-xl"
    >
      <h2 class="text-white text-4xl font-bold">Recording Complete!</h2>
      <p v-if="savingVideo" class="text-white">Saving video...</p>
      <p v-else class="text-white">Video saved successfully!</p>
      <p v-if="!savingVideo" class="text-white mt-4 text-xs">
        Returning to home in {{ returnCountDown }}...
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const videoComposable = useVideo();
const router = useRouter();

const video = ref<HTMLVideoElement | null>(null);
const countDown = ref(3);
const returnCountDown = ref(3);
const videoDuration = 60; // seconds
const recordingTimeLeft = ref(videoDuration);
const savingVideo = computed(() => videoComposable.state.loading);
const done = ref(false);

const formattedTime = computed(() => {
  const minutes = Math.floor(recordingTimeLeft.value / 60);
  const seconds = recordingTimeLeft.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1920, min: 1280 },
    height: { ideal: 1080, min: 720 },
    frameRate: { ideal: 30, min: 24 },
    facingMode: "user",
  },
  audio: {
    sampleRate: 44100,
    channelCount: 2,
    echoCancellation: true,
    noiseSuppression: true,
  },
});

let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];
let countdownInterval: NodeJS.Timeout | null = null;
let recordingInterval: NodeJS.Timeout | null = null;
let returningInterval: NodeJS.Timeout | null = null;

const start = async () => {
  // Configure MediaRecorder for high quality recording, preferring MP4
  const options: MediaRecorderOptions = {
    videoBitsPerSecond: 8000000, // 8 Mbps for high quality video
    audioBitsPerSecond: 128000, // 128 kbps for audio
  };

  // Try MP4 first for better compatibility and quality preservation
  const mp4Codecs = [
    "video/mp4;codecs=h264,aac",
    "video/mp4;codecs=avc1,aac",
    "video/mp4",
  ];
  for (const codec of mp4Codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
      options.mimeType = codec;
      break;
    }
  }

  // Fallback to high-quality WebM if MP4 not supported
  if (!options.mimeType) {
    const webmCodecs = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    for (const codec of webmCodecs) {
      if (MediaRecorder.isTypeSupported(codec)) {
        options.mimeType = codec;
        break;
      }
    }
  }

  recorder = new MediaRecorder(stream, options);
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();

  recordTimer();
};

const stop = () => {
  if (!recorder || !stream) return;

  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }

  done.value = true;

  recorder.stop();
  recorder.onstop = async () => {
    const mimeType = recorder?.mimeType || "video/webm";
    const blob = new Blob(chunks, { type: mimeType });
    console.log("Recording complete. Blob size:", blob.size, "Type:", mimeType);
    await videoComposable.saveVideo(blob);
    chunks = [];

    returnTimer();
  };

  stream.getTracks().forEach((t) => t.stop());
};

const cancelRecord = () => {
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
  stream?.getTracks().forEach((t) => t.stop());
  router.push("/");
};

const countdownTimer = () => {
  countDown.value = 3;
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
};

const recordTimer = () => {
  recordingTimeLeft.value = videoDuration;
  recordingInterval = setInterval(() => {
    recordingTimeLeft.value--;
    if (recordingTimeLeft.value === 0) {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
      }
      stop();
    }
  }, 1000);
};

const returnTimer = () => {
  returnCountDown.value = 3;
  returningInterval = setInterval(() => {
    returnCountDown.value--;
    if (returnCountDown.value === 0) {
      if (returningInterval) {
        clearInterval(returningInterval);
        returningInterval = null;
      }
      router.push("/");
    }
  }, 1000);
};

onMounted(() => {
  if (video.value) {
    video.value.srcObject = stream;
  }

  countdownTimer();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
  if (returningInterval) {
    clearInterval(returningInterval);
    returningInterval = null;
  }
  stream?.getTracks().forEach((t) => t.stop());
});
</script>
