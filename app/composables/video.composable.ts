import { videoService } from "~/services/video.service";

export function useVideo() {
  const state = reactive({
    loading: false,
    error: null as string | null,
  });

  const saveVideo = async (videoBlob: Blob) => {
    state.loading = true;
    state.error = null;

    try {
      await videoService.saveVideo(videoBlob);
    } catch (err) {
      state.error = err instanceof Error ? err.message : "Video upload failed";
    } finally {
      state.loading = false;
    }
  };

  return {
    ...state,
    saveVideo,
  };
}
