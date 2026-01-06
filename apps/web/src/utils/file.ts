import FileHashWorker from '@/utils/fileHash.worker?worker';

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
export const hashFile = async (file: File, algorithm: string = 'SHA-1') => {
  return new Promise<string>((resolve, reject) => {
    const worker = new FileHashWorker();
    worker.onmessage = e => {
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.hash);
      }
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };
    worker.postMessage({ file, algorithm });
  });
};
