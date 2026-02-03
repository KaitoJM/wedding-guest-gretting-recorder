import { useRuntimeConfig } from "#imports";

class VideoService {
  async getVideos(): Promise<{ videos: string[] }> {
    try {
      const config = useRuntimeConfig();
      const port = config.public.serverPort;

      const response = await fetch(`http://localhost:${port}/videos`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const videos = await response.json();
      return videos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async saveVideo(videoBlob: Blob): Promise<void> {
    try {
      const config = useRuntimeConfig();
      const port = config.public.serverPort;

      const formData = new FormData();
      formData.append("video", videoBlob, "video.webm");

      const response = await fetch(`http://localhost:${port}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Video uploaded successfully:", result);
    } catch (error) {
      console.error("Error saving video:", error);
      throw error;
    }
  }
}

export const videoService = new VideoService();

export default videoService;
