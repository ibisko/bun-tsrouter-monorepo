type SpawnBunParam = {
  cwd?: string;
  stdout?: (stream: ReadableStream<Uint8Array<ArrayBuffer>>) => Promise<void>;
  stderr?: (stream: ReadableStream<Uint8Array<ArrayBuffer>>) => Promise<void>;
};

export const spawnBun = async (cmd: string[], options?: SpawnBunParam) => {
  const subprocess = Bun.spawn(cmd, {
    stdout: options?.stdout ? 'pipe' : 'ignore',
    stderr: options?.stderr ? 'pipe' : 'ignore',
    cwd: options?.cwd,
  });

  const promises: Promise<void>[] = [];
  if (options?.stdout && subprocess.stdout) {
    promises.push(options.stdout(subprocess.stdout));
  }
  if (options?.stderr && subprocess.stderr) {
    promises.push(options.stderr(subprocess.stderr));
  }

  try {
    const [exitCode] = await Promise.all([subprocess.exited, ...promises]);
    if (exitCode !== 0) {
      throw new Error(`exited with code ${exitCode}`);
    }
  } catch (error) {
    subprocess.kill(); // 这只是做了发送关闭的信号，并不算真正停了
    await Promise.allSettled([subprocess.exited, ...promises]);
    throw error;
  }
};
