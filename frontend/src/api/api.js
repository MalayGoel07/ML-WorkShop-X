
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = {
  async get(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {throw { response: { data } };}
    return { data };
  },
  async post(path, body) {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {throw { response: { data } };}
    return { data };
  },
};

export default api;
