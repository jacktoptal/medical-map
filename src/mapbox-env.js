/**
 * Mapbox settings from Vite env (.env, .env.local, .env.[mode], etc.).
 * @see https://vite.dev/guide/env-and-mode
 */
export const MAPBOX_ACCESS_TOKEN = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? '').trim();

export const MAPBOX_STYLE = (import.meta.env.VITE_MAPBOX_STYLE ?? '').trim();

export function isMapboxConfigured() {
  return Boolean(MAPBOX_ACCESS_TOKEN && MAPBOX_STYLE);
}
