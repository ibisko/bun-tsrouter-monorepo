export const downloadExport = (sign: string, filename: string) => {
  const url = new URL('/api/file/download', import.meta.env.VITE_SERVER_URL);
  url.searchParams.append('sign', sign);
  const a = document.createElement('a');
  a.href = url.href;
  a.download = filename;
  a.click();
};
