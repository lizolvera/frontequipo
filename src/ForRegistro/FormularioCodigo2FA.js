import React, { useState } from "react";
import { verificarRegistro2FA, reenviarRegistro2FA } from "../Servicios/autenticacion";

export default function FormularioCodigo2FA({ tempToken, destino, onExito, onVolver }) {
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      setEnviando(true);
      await verificarRegistro2FA({ tempToken, codigo });
      setMsg("✅ Verificado. Tu cuenta está lista.");
      onExito && onExito();
    } catch (err) {
      setMsg("❌ " + (err.message || "Error al verificar"));
    } finally {
      setEnviando(false);
    }
  };

  const reenviar = async () => {
    setMsg("");
    try {
      setEnviando(true);
      await reenviarRegistro2FA({ tempToken });
      setMsg("✔️ Código reenviado a " + destino);
    } catch (err) {
      setMsg("❌ " + (err.message || "No se pudo reenviar"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-formulario">
      <div className="encabezado">
        <h1 className="titulo">Verifica tu cuenta</h1>
        <p className="subtitulo">Enviamos un código a <b>{destino}</b></p>
      </div>

      {msg && <div className="mensaje-general">{msg}</div>}

      <form onSubmit={enviar}>
        <div className="grid-campos">
          <div className="grupo-campo">
            <label className="etiqueta-campo" htmlFor="codigo">Código</label>
            <input
              id="codigo"
              name="codigo"
              className="input-campo"
              placeholder="123456"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
        </div>

        <button className="boton-principal" type="submit" disabled={enviando || codigo.length !== 6}>
          {enviando ? "Verificando..." : "Confirmar"}
        </button>

        <p className="nota-legal" style={{ marginTop: 12 }}>
          ¿No te llegó? <button type="button" className="btn-ver" onClick={reenviar} disabled={enviando}>Reenviar código</button>
        </p>

        <p className="nota-legal">
          <button type="button" className="btn-ver" onClick={onVolver}>Volver</button>
        </p>
      </form>
    </div>
  );
}
