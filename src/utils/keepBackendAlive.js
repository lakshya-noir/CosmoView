import { buildApiUrl } from "./apiBaseUrl";

const DEFAULT_KEEP_ALIVE_MS = 10 * 60 * 1000;
const configuredInterval = Number(process.env.REACT_APP_BACKEND_KEEP_ALIVE_MS);
const KEEP_ALIVE_INTERVAL_MS =
  Number.isFinite(configuredInterval) && configuredInterval > 0
    ? configuredInterval
    : DEFAULT_KEEP_ALIVE_MS;

function pingBackend() {
  fetch(buildApiUrl("/api/health/"), {
    cache: "no-store",
    keepalive: true,
  }).catch(() => {
    // Warm-up pings should never interrupt the user experience.
  });
}

export function startBackendKeepAlive() {
  pingBackend();

  const intervalId = window.setInterval(pingBackend, KEEP_ALIVE_INTERVAL_MS);

  return () => {
    window.clearInterval(intervalId);
  };
}
