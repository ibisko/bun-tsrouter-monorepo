import path from 'path';

export const readPromptFile = (filePath: string) => {
  const promptFilePath = path.join(process.cwd(), 'prompts', filePath);
  return Bun.file(promptFilePath).text();
};
