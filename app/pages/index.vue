<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950">
    <div
      v-if="backgroundImage"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      class="absolute inset-0 bg-cover bg-center"
    />
    <div
      class="absolute inset-0"
      :class="backgroundImage ? 'bg-black/45' : 'bg-[radial-gradient(circle_at_top,#334155,#020617_65%)]'"
    />

    <div
      class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <h1 class="max-w-4xl text-3xl font-bold text-white sm:text-5xl">
        Welcome to the Wedding Guest Greeting Recorder
      </h1>
      <p class="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
        Record and save your wedding guest greetings!
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink to="/record" class="rounded-full bg-rose-500 px-6 py-3 text-white transition hover:bg-rose-400">
          Record Now
        </NuxtLink>
        <NuxtLink to="/videos" class="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white transition hover:bg-white/15">
          Manage Media
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const BACKGROUND_STORAGE_KEY = 'wedding-greeting-background-image';

const backgroundImage = ref<string | null>(null);

onMounted(() => {
  if (typeof window === 'undefined') {
    return;
  }

  backgroundImage.value = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
});
</script>
