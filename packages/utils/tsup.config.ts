import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["./src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  ...options,
  async onSuccess() {
    console.log(process.env.SIGN_BUILDSUCCESS);
  },
}));
