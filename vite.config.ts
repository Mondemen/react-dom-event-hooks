import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { dirname, extname, relative, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

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
			// input: Object.fromEntries(glob.sync("lib/**/*.{ts,tsx}").map(file =>
			// [
			// 	// 1. The name of the entry point
			// 	relative("lib", file.slice(0, file.length - extname(file).length)),
			// 	// 2. The absolute path to the entry file
			// 	fileURLToPath(new URL(file, import.meta.url))
			// ])),
			// output:
			// {
			// 	assetFileNames: "assets/[name][extname]",
			// 	entryFileNames: "[name].js",
			// }
		}
	},
	plugins:
	[
		react(),
		// libInjectCss(),
		dts({ include: ["lib"] })
	]
})
