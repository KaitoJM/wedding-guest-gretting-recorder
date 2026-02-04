import { useRuntimeConfig } from "#imports";

class VideoService {
  config = useRuntimeConfig();
  apiURL = this.config.public.serverAPI;
  port = this.config.public.serverPort;

  async getVideos(): Promise<{ videos: string[] }> {
    try {
      const response = await fetch(`${this.apiURL}:${this.port}/videos`, {
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
      const formData = new FormData();
      formData.append("video", videoBlob, "video.webm");

      const response = await fetch(`${this.apiURL}:${this.port}/upload`, {
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
