export class APIError extends Error {
	error: string;
	status: number;
	constructor({ error, message, status }: { error: string; message: string; status: number }) {
		super(message);
		this.error = error;
		this.status = status;
	}
}

// TODO: Create one custom error class for each common status code which accepts a message and has a default message

// Generic server error
export class InternalServerError extends APIError {
	constructor(message = "Something went wrong.") {
		super({
			error: "internal_error",
			message,
			status: 500,
		});
	}
}

export class MissingSessionError extends APIError {
	constructor() {
		super({
			error: "missing_session",
			message: "Session cookie not found. This feature requires cookies.",
			status: 401,
		});
	}
}
