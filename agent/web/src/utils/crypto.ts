export async function getStringHash(data: string) {
  const encoder = new TextEncoder();
  const dataBuf = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', dataBuf);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
