const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", writePassword, body } = {}) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (writePassword) {
    headers["X-GOGOLISTAN-WRITE-PASSWORD"] = writePassword;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error("Impossible de contacter le serveur");
    error.status = 0;
    error.details = [];
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(payload?.error || "Request failed");
    error.status = response.status;
    error.details = payload?.errors || [];
    throw error;
  }

  return payload;
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body, writePassword) =>
    request(path, { method: "POST", body, writePassword }),
  patch: (path, body, writePassword) =>
    request(path, { method: "PATCH", body, writePassword }),
  delete: (path, writePassword) =>
    request(path, { method: "DELETE", writePassword }),
};
