import { APIError } from "@/helpers/errors";

export function errorToResponse(err: APIError) {
	return {
		error: err.error,
		message: err.message,
	};
}
