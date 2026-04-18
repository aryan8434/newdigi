/**
 * SHA-256 hash using Web Crypto API
 */
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(typeof text === 'string' ? text : JSON.stringify(text));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
