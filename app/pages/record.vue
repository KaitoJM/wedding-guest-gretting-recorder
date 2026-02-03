<template>
  <div>
    <div v-if="!start" class="mb-6">
      <p>You will be given 1 minute to record your greeting.</p>
      <p>
        If you are already prepared, click the "Start Recording" button below.
      </p>
      <div>
        <button class="text-blue-500 underline mb-4" @click="start = true">
          Start Recording
        </button>
        <button @click="$router.push('/')">Back to Home</button>
      </div>
    </div>
    <VideoMonitor v-else />
  </div>
</template>

<script lang="ts" setup>
const start = ref(false);
</script>
