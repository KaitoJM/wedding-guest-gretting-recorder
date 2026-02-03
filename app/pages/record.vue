<template>
  <div>
    <div
      v-if="!start"
      class="w-screen h-screen flex flex-col items-center justify-center space-y-4"
    >
      <p>You will be given 1 minute to record your greeting.</p>
      <p>
        If you are already prepared, click the "Start Recording" button below.
      </p>
      <div class="flex space-x-4">
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          @click="start = true"
        >
          Start Recording
        </button>
        <button
          @click="$router.push('/')"
          class="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
    <VideoMonitor v-else />
  </div>
</template>

<script lang="ts" setup>
const start = ref(false);
</script>
