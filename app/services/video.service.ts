class VideoService {
  async saveVideo(videoBlob: Blob): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "video.webm");

      const response = await fetch("http://localhost:3001/upload", {
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

export default VideoService;
