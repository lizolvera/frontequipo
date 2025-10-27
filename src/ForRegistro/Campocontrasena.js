import React, { useState } from "react";

export default function CampoContrasena({
  etiqueta,
  nombre,
  valor,
  onCambio,
  placeholder,
  error,
  deshabilitado = false,
}) {
  const [ver, setVer] = useState(false);

  return (
    <div className="grupo-campo">
      <label htmlFor={nombre} className="etiqueta-campo">{etiqueta}</label>

      <div className={`envoltura-password ${error ? "input-error" : ""}`}>
        <input
          id={nombre}
          name={nombre}
          type={ver ? "text" : "password"}
          value={valor}
          onChange={onCambio}
          placeholder={placeholder}
          className="input-campo sin-borde"
          disabled={deshabilitado}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="btn-ver"
          onClick={() => setVer((v) => !v)}
          aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {ver ? "Ocultar" : "Ver"}
        </button>
      </div>

      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
}
