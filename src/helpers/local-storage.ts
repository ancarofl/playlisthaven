export function saveToStorage(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
	} catch (err) {
		console.warn(`Failed to save ${key} to local storage`, err);
	}
}

export function getFromStorage(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch (err) {
		console.warn(`Failed to get ${key} from local storage`, err);
		return null;
	}
}

export function clearFromStorage(key: string) {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.warn(`Failed to clear ${key} from local storage`, err);
	}
}
