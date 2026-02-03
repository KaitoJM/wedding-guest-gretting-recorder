class VideoService {
  async saveVideo(videoBlob: Blob): Promise<void> {
    try {
      // Simulate video upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would typically upload the videoBlob to your server
    } catch (error) {
      console.error("Error saving video:", error);
      throw error;
    }
  }
}

export const videoService = new VideoService();

export default VideoService;
