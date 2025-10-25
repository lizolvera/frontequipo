import React from "react";

export default function CampoTexto({
  etiqueta,
  nombre,
  tipo = "text",
  valor,
  onCambio,
  placeholder,
  error,
  deshabilitado = false,
  autoComplete,
}) {
  return (
    <div className="grupo-campo">
      <label htmlFor={nombre} className="etiqueta-campo">{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        value={valor}
        onChange={onCambio}
        placeholder={placeholder}
        className={`input-campo ${error ? "input-error" : ""}`}
        disabled={deshabilitado}
        autoComplete={autoComplete}
      />
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
}
