const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

async function request(path, { body, ...opts } = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
      // credentials: "include", // descomenta si el backend usa cookies/sesión
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.mensaje || "Error de servidor");
    return data;
  } catch (err) {
    throw new Error(err.message || "Error de red");
  }
}

export function registrarUsuario(payload) {
  return request("/registro", { body: payload });
}

export function verificarRegistro2FA({ tempToken, codigo }) {
  return request("/registro/2fa/verificar", { body: { tempToken, codigo } });
}

export function reenviarRegistro2FA({ tempToken }) {
  return request("/registro/2fa/reenviar", { body: { tempToken } });
}
