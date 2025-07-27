export function debugLogBlue(message: string) {
	console.log("\x1b[34m%s\x1b[0m", message);
}

export function debugLogGreen(message: string) {
	console.log("\x1b[32m%s\x1b[0m", message);
}

export function debugLogRed(message: string) {
	console.log("\x1b[31m%s\x1b[0m", message);
}
