
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function registrarUsuario(payload) {
  const r = await fetch(`${BASE_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.mensaje || "No se pudo registrar");
  return data; // { ok } o { requires2fa, canal, destino, tempToken }
}


async function request(endpoint, { body, method = "POST" } = {}) {
  const r = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.mensaje || "Error en la solicitud");
  return data;
}

export function verificarRegistro2FA({ tempToken, codigo }) {
  return request("/api/usuarios/register/2fa/verificar", { body: { tempToken, codigo } });
}

export function reenviarRegistro2FA({ tempToken }) {
  return request("/api/usuarios/register/2fa/reenviar", { body: { tempToken } });
}
