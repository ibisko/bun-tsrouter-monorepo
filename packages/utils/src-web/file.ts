/** 文件摘要 */
export const hashFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('MD5', buffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hashString = async (data: string, algorithm: string = 'sha-1') => {
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
