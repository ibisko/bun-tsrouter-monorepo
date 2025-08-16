import { defineConfig } from "tsup";
import { ChildProcess, spawn } from "child_process";

let process: ChildProcess;

export default defineConfig((options) => ({
  entryPoints: ["./src/main.ts"],
  format: ["cjs"],
  // clean: true,
  dts: true,
  ...options,
  watch: ["./src/**/*.ts"],
  silent: true, // 禁用tsup日志
  async onSuccess() {
    if (process) {
      process.kill();
    }
    process = spawn("node", ["./dist/main.js"], { stdio: "inherit" });
  },
}));
