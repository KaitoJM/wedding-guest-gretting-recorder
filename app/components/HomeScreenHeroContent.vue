<template>
  <div :class="containerClass" class="flex h-full w-full flex-col justify-start">
    <h3 :style="titleStyleObject" class="max-w-4xl font-bold">
      {{ title }}
    </h3>
    <p :style="subtitleStyleObject" class="mt-4 max-w-2xl">
      {{ subtitle }}
    </p>
    <div :class="actionsClass" class="mt-8 flex w-full flex-wrap items-center gap-3">
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
const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    useLinks?: boolean;
    titleFontSize?: number;
    titleColor?: string;
    titleFontFamily?: string;
    titleFontWeight?: number | string;
    subtitleFontSize?: number;
    subtitleColor?: string;
    subtitleFontFamily?: string;
    subtitleFontWeight?: number | string;
    contentAlign?: 'left' | 'center' | 'right';
  }>(),
  {
    useLinks: false,
    titleFontSize: 48,
    titleColor: '#ffffff',
    titleFontFamily: 'inherit',
    titleFontWeight: 700,
    subtitleFontSize: 18,
    subtitleColor: '#e2e8f0',
    subtitleFontFamily: 'inherit',
    subtitleFontWeight: 400,
    contentAlign: 'left'
  }
);

const containerClass = computed(() => {
  if (props.contentAlign === 'center') {
    return 'items-center text-center';
  }

  if (props.contentAlign === 'right') {
    return 'items-end text-right';
  }

  return 'items-start text-left';
});

const actionsClass = computed(() => {
  if (props.contentAlign === 'center') {
    return 'justify-center';
  }

  if (props.contentAlign === 'right') {
    return 'justify-end';
  }

  return 'justify-start';
});

const titleStyleObject = computed(() => ({
  fontSize: `${props.titleFontSize}px`,
  color: props.titleColor,
  fontFamily: props.titleFontFamily,
  fontWeight: String(props.titleFontWeight),
  lineHeight: '1.1'
}));

const subtitleStyleObject = computed(() => ({
  fontSize: `${props.subtitleFontSize}px`,
  color: props.subtitleColor,
  fontFamily: props.subtitleFontFamily,
  fontWeight: String(props.subtitleFontWeight),
  lineHeight: '1.5'
}));
</script>
