import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
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
