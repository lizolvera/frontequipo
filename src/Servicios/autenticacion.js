const BASE_URL = "http://localhost:3001"; // cambia si deployas

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

export async function verificarRegistro2FA({ tempToken, codigo }) {
  const r = await fetch(`${BASE_URL}/registro/2fa/verificar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempToken, codigo }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.mensaje || "Código inválido o expirado");
  return data;
}

export async function reenviarRegistro2FA({ tempToken }) {
  const r = await fetch(`${BASE_URL}/registro/2fa/reenviar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempToken }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.mensaje || "No se pudo reenviar");
  return data;
}
