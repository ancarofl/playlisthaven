import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()], // add this plugin
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@tests": path.resolve(__dirname, "tests"),
		},
	},
	test: {
		globals: true,
		environment: "node",
		setupFiles: "./src/setup-tests.ts",
		coverage: {
			provider: "v8", // or "istanbul"
			reporter: ["text", "html"], // show in terminal and generate HTML report
			reportsDirectory: "./coverage",
			all: true, // include files even if not tested
			include: ["src/**/*.{ts,tsx,js,jsx}"], // path to source files
			exclude: ["src/generated/prisma/**", "node_modules/**", "tests/**"],
		},
	},
});
