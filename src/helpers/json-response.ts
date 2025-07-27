import { APIError, InternalServerError } from "./errors";

export function successResponse<T>(data: T, status = 200) {
	return Response.json({ success: true, data }, { status });
}

export function errorResponse(err: unknown) {
	if (err instanceof APIError) {
		return Response.json({ error: err.error, message: err.message }, { status: err.status });
	}
	// Fallback for unhandled errors
	const fallback = new InternalServerError();
	return Response.json({ error: fallback.error, message: fallback.message }, { status: fallback.status });
}
