// Web Push identity (VAPID). The public key is meant to be public — browsers
// need it to subscribe. The private key is VAPID_PRIVATE_KEY (env var only).
export const VAPID_PUBLIC_KEY =
  'BO3BUhhK6XW8AT7eb5JT9BqFRJRkjG4E8BRykCTQQL020ZuO2KdalX_l4gzN0aow0tSobsoMEO3z58oMHLaK1fM';

/** The key in the byte form PushManager.subscribe wants. */
export function vapidKeyBytes(): Uint8Array<ArrayBuffer> {
  const base64 = VAPID_PUBLIC_KEY.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
