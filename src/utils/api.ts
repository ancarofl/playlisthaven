import { APIError } from "@/lib/errors";

// Converts an exception/API error into a standardized HTTP JSON response
export function errorResponse(err: APIError) {
	return Response.json({ error: err.error, message: err.message }, { status: err.status });
}
