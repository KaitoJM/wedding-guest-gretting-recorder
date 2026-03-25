<template>
  <div class="flex h-full w-full flex-col items-start justify-start text-left">
    <h3 class="max-w-4xl text-3xl font-bold text-white sm:text-5xl">
      {{ title }}
    </h3>
    <p class="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
      {{ subtitle }}
    </p>
    <div class="mt-8 flex flex-wrap items-center gap-3">
      <NuxtLink
        v-if="useLinks"
        to="/record"
        class="rounded-full bg-rose-500 px-6 py-3 text-white transition hover:bg-rose-400"
      >
        Record Now
      </NuxtLink>
      <span v-else class="rounded-full bg-rose-500 px-6 py-3 text-white">
        Record Now
      </span>

      <NuxtLink
        v-if="useLinks"
        to="/videos"
        class="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white transition hover:bg-white/15"
      >
        Manage Media
      </NuxtLink>
      <span
        v-else
        class="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white"
      >
        Manage Media
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    useLinks?: boolean;
  }>(),
  {
    useLinks: false
  }
);
</script>
