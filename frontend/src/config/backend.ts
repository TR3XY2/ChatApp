const DEFAULT_BACKEND_BASE_URL = "https://localhost:7053";

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getBackendBaseUrl(): string {
  // In Vite dev, proxy /api and /chat through the dev server to bypass CORS.
  if (import.meta.env.DEV) {
    return "";
  }

  const configuredUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  if (configuredUrl && configuredUrl.trim().length > 0) {
    return trimTrailingSlash(configuredUrl.trim());
  }

  return DEFAULT_BACKEND_BASE_URL;
}
