const exec = (cwd: string) => Bun.spawn(["bun", "run", "dev"], {
    cwd,
    stdout: "inherit", // 输出到当前终端
})

// 等待所有任务完成（或任意一个失败）
~(async function () {
    await Promise.all([
        exec("./packages/utils"),
        exec("./packages/ui"),
        exec("./packages/tsrouter"),
        exec("./apps/web"),
        exec("./apps/server"),
    ]);
}())