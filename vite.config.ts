import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint2";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(
{
	build:
	{
		copyPublicDir: false,
		lib:
		{
			entry: resolve(__dirname, "lib/index.js"),
			name: "react-dom-event-hooks",
			fileName: "index",
			formats: ["es", "umd"]
		},
		rollupOptions:
		{
			external: ["react", "react/jsx-runtime"],
			output: {globals: {react: "react"}}
		}
	},
	plugins:
	[
		react(),
		eslint(),
		// libInjectCss(),
		dts({ include: ["lib"] })
	]
})
