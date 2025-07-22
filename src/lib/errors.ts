export class MissingSessionError extends Error {
	code = "NO_SESSION";
	status = 401;

	constructor(message = "Session cookie not found. This feature requires cookies.") {
		super(message);
		this.name = "MissingSessionError";
	}
}
