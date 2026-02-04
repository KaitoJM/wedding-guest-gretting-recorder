import { videoService } from "~/services/video.service";
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRuntimeConfig } from "#imports";

export function useVideo() {
  const state = reactive({
    loading: false,
    error: null as string | null,
  });

  const videos = ref<string[]>([]);

  const config = useRuntimeConfig();
  const port = config.public.serverPort || 3001;
  const wsUrl = `ws://localhost:${port}`;

  let ws: WebSocket | null = null;
  let reconnectDelay = 1000;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const fetchVideos = async () => {
    try {
      const result = await videoService.getVideos();
      videos.value = result.videos || [];
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  const connect = () => {
    if (typeof window === "undefined") return;
    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WS connected");
        reconnectDelay = 1000; // reset backoff
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg && msg.type === "new-video") {
            // Refresh list when a new video is saved
            videos.value.unshift(msg.filename);
          }
        } catch (err) {
          console.error("Invalid WS message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WS closed, scheduling reconnect");
        scheduleReconnect();
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
        try {
          ws?.close();
        } catch (e) {}
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      connect();
    }, reconnectDelay);
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      try {
        ws.close();
      } catch (e) {}
      ws = null;
    }
  };

  const saveVideo = async (videoBlob: Blob) => {
    state.loading = true;
    state.error = null;

    try {
      await videoService.saveVideo(videoBlob);
      // server will notify via websocket; optionally fetch immediately
      await fetchVideos();
    } catch (err) {
      state.error = err instanceof Error ? err.message : "Video upload failed";
    } finally {
      state.loading = false;
    }
  };

  onMounted(() => {
    fetchVideos();
    connect();
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", disconnect);
    }
  });

  onUnmounted(() => {
    disconnect();
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", disconnect);
    }
  });

  return {
    state,
    videos,
    saveVideo,
    fetchVideos,
    disconnect,
  };
}
