
import React, { useEffect, useState } from "react";
import CampoTexto from "./CampoTexto";
import { verificarRegistro2FA, reenviarRegistro2FA } from "../Servicios/autenticacion";

export default function FormularioCodigo2FA({
  tempToken,
  canal,                // "email" | "sms"
  destinoEnmascarado,   // ej. j***@dominio.com
  onCompletado,         // () => void
  onCancelar,           // () => void
}) {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    setCooldown(60);
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [tempToken]);

  const enviar = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!/^\d{6}$/.test(codigo)) {
      setMensaje("Ingresa el código de 6 dígitos.");
      return;
    }
    try {
      setCargando(true);
      await verificarRegistro2FA({ tempToken, codigo });
      onCompletado?.();
    } catch (err) {
      setMensaje(err.message || "Código incorrecto o expirado.");
    } finally {
      setCargando(false);
    }
  };

  const reenviar = async () => {
    if (cooldown > 0) return;
    try {
      setCargando(true);
      await reenviarRegistro2FA({ tempToken });
      setMensaje("📨 Código reenviado.");
      setCooldown(60);
    } catch (err) {
      setMensaje(err.message || "No se pudo reenviar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <p className="subtitulo" style={{ textAlign: "center", marginBottom: 12 }}>
        Enviamos un código a tu {canal === "sms" ? "teléfono" : "correo"}: <b>{destinoEnmascarado}</b>
      </p>

      <form onSubmit={enviar} noValidate>
        <div className="grid-campos">
          <CampoTexto
            etiqueta="Código de 6 dígitos"
            nombre="codigo"
            tipo="text"
            valor={codigo}
            onCambio={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
          />
        </div>

        <button className="boton-principal" disabled={cargando}>
          {cargando ? "Verificando..." : "Verificar código"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <button type="button" className="btn-ver" onClick={onCancelar}>← Volver</button>
          <button
            type="button"
            className="btn-ver"
            onClick={reenviar}
            disabled={cooldown > 0 || cargando}
            title={cooldown > 0 ? `Espera ${cooldown}s` : "Reenviar código"}
          >
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
          </button>
        </div>

        {mensaje && <div className="mensaje-general" style={{ marginTop: 12 }}>{mensaje}</div>}
      </form>
    </>
  );
}
