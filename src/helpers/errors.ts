// Base API error(exception) class
export class APIError extends Error {
	error: string;
	status: number;
	constructor({ error, message, status }: { error: string; message: string; status: number }) {
		super(message);
		this.error = error;
		this.status = status;
	}
}

// Common
// 400 Bad Request
export class BadRequestError extends APIError {
	constructor(message = "Bad request.") {
		super({
			error: "bad_request",
			message,
			status: 400,
		});
	}
}

// 401 Unauthorized
export class UnauthorizedError extends APIError {
	constructor(message = "Unauthorized.") {
		super({
			error: "unauthorized",
			message,
			status: 401,
		});
	}
}

// 403 Forbidden
export class ForbiddenError extends APIError {
	constructor(message = "Forbidden.") {
		super({
			error: "forbidden",
			message,
			status: 403,
		});
	}
}

// 404 Not Found
export class NotFoundError extends APIError {
	constructor(message = "Resource not found.") {
		super({
			error: "not_found",
			message,
			status: 404,
		});
	}
}

// 500 Internal Server Error
export class InternalServerError extends APIError {
	constructor(message = "Something went wrong.") {
		super({
			error: "internal_server_error",
			message,
			status: 500,
		});
	}
}

// Specific
export class UnsupportedProviderError extends BadRequestError {
	constructor(message = "Unsupported OAuth provider.") {
		super(message);
		this.error = "unsupported_provider";
	}
}

export class MissingSessionError extends UnauthorizedError {
	constructor() {
		super("Session cookie not found. This feature requires cookies.");
		this.error = "no_session";
	}
}
