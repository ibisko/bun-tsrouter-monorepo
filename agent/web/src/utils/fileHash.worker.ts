// hash.worker.ts
self.onmessage = async e => {
  const { file, algorithm = 'SHA-1' } = e.data;
  try {
    const buf = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algorithm, buf);
    const hashArray = new Uint8Array(hashBuffer);
    const hash = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    self.postMessage({ hash });
  } catch (error) {
    if (error instanceof Error) {
      self.postMessage({ error: error.message });
    }
  }
};
