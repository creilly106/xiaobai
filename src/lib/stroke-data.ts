// hanzi-writer fetches stroke data from a CDN by default. We serve it from
// public/strokes/ instead (see scripts/copy-strokes.mjs) so it works offline.

type OnLoad = (data: unknown) => void;
type OnError = (reason?: unknown) => void;

export function charDataLoader(char: string, onLoad: OnLoad, onError: OnError): void {
  fetch(`/strokes/${encodeURIComponent(char)}.json`)
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
    .then(onLoad, onError);
}
