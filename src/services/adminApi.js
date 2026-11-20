const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "admin_user";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dev-evcowbbe.transev.site/api";

export class AdminApiError extends Error {
  constructor(message, { status, code, details, payload } = {}) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.payload = payload;
  }
}

function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function readResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return response.text();
}

function unwrap(payload) {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload &&
    !("error" in payload) &&
    Object.keys(payload).length <= 2
  ) {
    return payload.data;
  }
  return payload;
}

async function refreshSession() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return false;

  const response = await fetch(`${API_BASE_URL}/v1/admin/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) return false;

  const result = unwrap(await readResponse(response));
  const accessToken = result?.access_token || result?.accessToken;
  const nextRefreshToken = result?.refresh_token || result?.refreshToken;
  if (!accessToken) return false;

  localStorage.setItem(ACCESS_KEY, accessToken);
  if (nextRefreshToken) localStorage.setItem(REFRESH_KEY, nextRefreshToken);
  return true;
}

function makeError(response, payload) {
  const message =
    payload &&
    typeof payload === "object" &&
    (payload.message ||
      payload.error?.message ||
      (typeof payload.error === "string" ? payload.error : null) ||
      payload.detail);
  return new AdminApiError(message || `Request failed (${response.status})`, {
    status: response.status,
    code: payload?.error?.code || payload?.code,
    details: payload?.error?.details,
    payload,
  });
}

export async function adminApiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    auth = true,
    responseType = "json",
  } = options;
  const requestHeaders = {
    Accept: "application/json",
    ...extraHeaders,
  };
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const send = () => {
    const token = auth ? localStorage.getItem(ACCESS_KEY) : null;
    const headers = { ...requestHeaders };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_BASE_URL}${path.replace(/^\/api(?=\/)/, "")}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  };

  let response = await send();
  if (
    response.status === 401 &&
    auth &&
    !path.includes("/auth/refresh") &&
    (await refreshSession())
  ) {
    response = await send();
  }
  if (response.status === 401 && auth) {
    clearSession();
    throw new AdminApiError("Your session has expired. Sign in again.", {
      status: 401,
      code: "SESSION_EXPIRED",
    });
  }

  if (responseType === "blob" && response.ok) {
    return { data: await response.blob(), headers: response.headers, status: response.status };
  }

  const payload = await readResponse(response);
  if (!response.ok) throw makeError(response, payload);
  return {
    data: unwrap(payload),
    headers: response.headers,
    status: response.status,
  };
}
