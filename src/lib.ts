export function format_date(d: Date): string {
	const year = d.getFullYear().toString();
	const month = (d.getMonth() + 1).toString().padStart(2, "0");
	const day = d.getDate().toString().padStart(2, "0");

	return [year, month, day].join("-");
}

const today = new Date();
const format_keys: Record<string, string> = {
	/* eslint-disable @typescript-eslint/naming-convention */
	"<d>": today.toLocaleDateString("de-de", { day: "numeric" }),
	"<dd>": today.toLocaleDateString("de-de", { day: "2-digit" }),
	"<D>": today.toLocaleDateString("de-de", { weekday: "long" }),
	"<DD>": today.toLocaleDateString("de-de", { weekday: "short" }),
	"<m>": today.toLocaleDateString("de-de", { month: "numeric" }),
	"<mm>": today.toLocaleDateString("de-de", { month: "2-digit" }),
	"<M>": today.toLocaleDateString("de-de", { month: "short" }),
	"<MM>": today.toLocaleDateString("de-de", { month: "long" }),
	"<yy>": today.toLocaleDateString("de-de", { year: "2-digit" }),
	"<yyyy>": today.toLocaleDateString("de-de", { year: "numeric" })
	/* eslint-enable @typescript-eslint/naming-convention */
};

export function create_directory(f: string): string {
	Object.entries(format_keys).forEach(([k, r]) => {
		f = f.replaceAll(k, r);
	});

	return f;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum http {
	StatusContinue = 100,
	StatusSwitchingProtocols = 101,
	StatusEarlyHints = 103,
	StatusOK = 200,
	StatusCreated = 201,
	StatusAccepted = 202,
	StatusNonauthoritativeInformation = 203,
	StatusNoContent = 204,
	StatusResetContent = 205,
	StatusPartialContent = 206,
	StatusMultipleChoices = 300,
	StatusMovedPermanently = 301,
	StatusFound = 302,
	StatusSeeOther = 303,
	StatusNotModified = 304,
	StatusUnused = 306,
	StatusTemporaryRedirect = 307,
	StatusPermanent = 308,
	StatusBadRequest = 400,
	StatusUnauthorized = 401,
	StatusForbidden = 403,
	StatusNotFound = 404,
	StatusMethodNotAllowed = 405,
	StatusNotAcceptable = 406,
	StatusProxyAuthenticationRequired = 407,
	StatusRequestTimeout = 408,
	StatusConflict = 409,
	StatusGone = 410,
	StatusLengthRequired = 411,
	StatusPreconditionFailed = 412,
	StatusPayloadTooLarge = 413,
	StatusURITooLong = 414,
	StatusUnsupportedMediaType = 415,
	StatusRangeNotSatisfiable = 416,
	StatusExpectationFailed = 417,
	StatusImateapot = 418,
	StatusMisdirectedRequest = 421,
	StatusTooEarly = 425,
	StatusUpgradeRequired = 426,
	StatusPreconditionRequired = 428,
	StatusTooManyRequests = 429,
	StatusRequestHeaderFieldsTooLarge = 431,
	StatusUnavailableForLegalReasons = 451,
	StatusInternalServerError = 500,
	StatusNotImplemented = 501,
	StatusBadGateway = 502,
	StatusServiceUnavailable = 503,
	StatusGatewayTimeout = 504,
	StatusHTTPVersionNotSupported = 505,
	StatusVariantAlsoNegotiates = 506,
	StatusNotExtended = 510,
	StatusNetworkAuthenticationRequired = 511
}

// eslint-disable-next-line @typescript-eslint/naming-convention
type QueryParams = Record<string, string | { toString(): string }>;
export type APICallResult<T extends object> = { data: T; status: http; ok: boolean };
export async function api_call<K extends object>(
	method: "GET",
	api: string,
	params?: QueryParams
): Promise<APICallResult<K>>;
export async function api_call<K extends object>(
	method: "POST" | "PATCH",
	api: string,
	params?: QueryParams,
	body?: object
): Promise<APICallResult<K>>;
export async function api_call<K extends object>(
	method: "DELETE",
	api: string,
	params?: QueryParams,
	body?: object
): Promise<APICallResult<K>>;
export async function api_call<K extends object>(
	method: "GET" | "POST" | "PATCH" | "DELETE",
	api: string,
	params?: QueryParams,
	body?: object | undefined
): Promise<APICallResult<K>> {
	let url = window.origin + "/api/" + api;

	if (params) {
		const urlsearchparams = new URLSearchParams(
			Object.fromEntries(
				Object.entries(params).map(([key, value]): [string, string] => {
					if (typeof value !== "string") {
						return [key, value.toString()];
					} else {
						return [key, value];
					}
				})
			)
		);

		url += "?" + urlsearchparams.toString();
	}

	const response = await fetch(url, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			"Content-Type": "application/json; charset=UTF-8"
		},
		method,
		body: body !== undefined ? JSON.stringify(body) : undefined
	});

	const content_type = response.headers.get("content-type");

	if (content_type && content_type.indexOf("application/json") !== -1) {
		return { data: (await response.json()) as K, status: response.status, ok: response.ok };
	} else {
		return { status: response.status, data: undefined as unknown as K, ok: response.ok };
	}
}
