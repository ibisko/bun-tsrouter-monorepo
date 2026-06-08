/** 文件摘要 */
export const hashFile = async (file: File | ArrayBuffer) => {
  let buffer: ArrayBuffer;
  if (file instanceof File) {
    buffer = await file.arrayBuffer();
  } else if (file instanceof ArrayBuffer) {
    buffer = file;
  }
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer!);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hashString = async (data: string, algorithm: string = 'SHA-256') => {
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
