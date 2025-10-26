import React from "react";

export default function CampoTexto({
  etiqueta,
  nombre,
  tipo = "text",      // "text", "email", "password" o "select"
  valor,
  onCambio,
  placeholder,
  error,
  deshabilitado = false,
  autoComplete,
  opciones = [],      // SOLO si tipo === "select"
}) {
  const clase = `input-campo ${error ? "input-error" : ""}`;

  return (
    <div className="grupo-campo">
      <label htmlFor={nombre} className="etiqueta-campo">{etiqueta}</label>

      {tipo === "select" ? (
        <select
          id={nombre}
          name={nombre}
          value={valor}
          onChange={onCambio}
          className={clase}
          disabled={deshabilitado}
        >
          <option value="">{placeholder || "Selecciona una opción…"}</option>
          {opciones.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      ) : (
        <input
          id={nombre}
          name={nombre}
          type={tipo}
          value={valor}
          onChange={onCambio}
          placeholder={placeholder}
          className={clase}
          disabled={deshabilitado}
          autoComplete={autoComplete}
        />
      )}

      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
}
