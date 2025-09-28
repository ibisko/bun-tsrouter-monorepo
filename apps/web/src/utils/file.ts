export async function selectLocalFiles(accept: string, multiple?: boolean): Promise<FileList | null>;
export async function selectLocalFiles(multiple: boolean): Promise<FileList | null>;
export async function selectLocalFiles(accept: string | boolean, multiple = false): Promise<FileList | null> {
  if (typeof accept === 'boolean') {
    multiple = accept;
    accept = '';
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;
  input.click();
  return new Promise(resolve => {
    input.oncancel = () => resolve(null);
    input.onchange = () => {
      if (input.files) {
        resolve(input.files);
      }
    };
  });
}

export const readFileTxt = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'utf-8');
  });

/** 文件摘要 SHA-1 */
export const hashFile = async (file: File) => {
  const buf = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', buf);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
