export type ContentAlign = "left" | "center" | "right";

export type HeroTextStyle = {
  titleFontSize: number;
  titleColor: string;
  titleFontFamily: string;
  titleFontWeight: number;
  subtitleFontSize: number;
  subtitleColor: string;
  subtitleFontFamily: string;
  subtitleFontWeight: number;
  contentAlign: ContentAlign;
  primaryButtonColor: string;
  useGlassEffect: boolean;
};

export type HeroLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const BACKGROUND_STORAGE_KEY = "wedding-greeting-background-image";
export const WELCOME_TITLE_STORAGE_KEY = "wedding-greeting-welcome-title";
export const WELCOME_SUBTITLE_STORAGE_KEY = "wedding-greeting-welcome-subtitle";
export const HERO_TEXT_STYLE_STORAGE_KEY = "wedding-greeting-hero-text-style";
export const HERO_LAYOUT_STORAGE_KEY = "wedding-greeting-hero-layout";

export const DEFAULT_WELCOME_TITLE = "Welcome to Greeting Recorder";
export const DEFAULT_WELCOME_SUBTITLE = "Record and save your greetings!";

export const DEFAULT_HERO_TEXT_STYLE: HeroTextStyle = {
  titleFontSize: 48,
  titleColor: "#ffffff",
  titleFontFamily: "inherit",
  titleFontWeight: 700,
  subtitleFontSize: 18,
  subtitleColor: "#e2e8f0",
  subtitleFontFamily: "inherit",
  subtitleFontWeight: 400,
  contentAlign: "center",
  primaryButtonColor: "#f43f5e",
  useGlassEffect: true,
};

export const DEFAULT_HERO_LAYOUT: HeroLayout = {
  x: 29,
  y: 38,
  width: 42,
  height: 24,
};

export const MIN_HERO_WIDTH = 18;
export const MIN_HERO_HEIGHT = 12;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getStoredNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const initHomeScreenConfigStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.localStorage.getItem(HERO_TEXT_STYLE_STORAGE_KEY)) {
    window.localStorage.setItem(
      HERO_TEXT_STYLE_STORAGE_KEY,
      JSON.stringify(DEFAULT_HERO_TEXT_STYLE),
    );
  }

  if (!window.localStorage.getItem(HERO_LAYOUT_STORAGE_KEY)) {
    window.localStorage.setItem(
      HERO_LAYOUT_STORAGE_KEY,
      JSON.stringify(DEFAULT_HERO_LAYOUT),
    );
  }
};
