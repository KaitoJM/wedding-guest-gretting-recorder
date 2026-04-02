<template>
  <div
    :class="[containerClass, glassEffectClass]"
    class="flex h-full w-full flex-col justify-center rounded-3xl"
  >
    <h3 :style="titleStyleObject" class="max-w-4xl font-bold">
      {{ title }}
    </h3>
    <p :style="subtitleStyleObject" class="mt-4 max-w-2xl">
      {{ subtitle }}
    </p>
    <div
      :class="actionsClass"
      class="mt-8 flex w-full flex-wrap items-center gap-3"
    >
      <NuxtLink
        v-if="useLinks"
        to="/record"
        :style="primaryButtonStyleObject"
        class="rounded-full px-6 py-3 text-white transition"
      >
        Record Now
      </NuxtLink>
      <span
        v-else
        :style="primaryButtonStyleObject"
        class="rounded-full px-6 py-3 text-white"
      >
        Record Now
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
    contentAlign?: "left" | "center" | "right";
    primaryButtonColor?: string;
    useGlassEffect?: boolean;
  }>(),
  {
    useLinks: false,
    titleFontSize: 48,
    titleColor: "#ffffff",
    titleFontFamily: "inherit",
    titleFontWeight: 700,
    subtitleFontSize: 18,
    subtitleColor: "#e2e8f0",
    subtitleFontFamily: "inherit",
    subtitleFontWeight: 400,
    contentAlign: "left",
    primaryButtonColor: "#f43f5e",
    useGlassEffect: true,
  },
);

const containerClass = computed(() => {
  if (props.contentAlign === "center") {
    return "items-center text-center";
  }

  if (props.contentAlign === "right") {
    return "items-end text-right";
  }

  return "items-start text-left";
});

const actionsClass = computed(() => {
  if (props.contentAlign === "center") {
    return "justify-center";
  }

  if (props.contentAlign === "right") {
    return "justify-end";
  }

  return "justify-start";
});

const glassEffectClass = computed(() =>
  props.useGlassEffect
    ? "border border-white/10 bg-white/10 backdrop-blur-md"
    : "",
);

const titleStyleObject = computed(() => ({
  fontSize: `${props.titleFontSize}px`,
  color: props.titleColor,
  fontFamily: props.titleFontFamily,
  fontWeight: String(props.titleFontWeight),
  lineHeight: "1.1",
}));

const subtitleStyleObject = computed(() => ({
  fontSize: `${props.subtitleFontSize}px`,
  color: props.subtitleColor,
  fontFamily: props.subtitleFontFamily,
  fontWeight: String(props.subtitleFontWeight),
  lineHeight: "1.5",
}));

const primaryButtonStyleObject = computed(() => ({
  backgroundColor: props.primaryButtonColor,
}));
</script>
