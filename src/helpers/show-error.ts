// TODO: Toast not alert
export function showError(msg: string, error?: unknown) {
	if (error) console.error(msg, error);
	alert(msg);
}
