import React, { useState } from "react";
import CampoTexto from "./CampoTexto";
import CampoContrasena from "./Campocontrasena";
import "../../src/Style/formulario.css";

// Validaciones
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/; // 8+, minúscula, mayúscula y número

export default function RegistroFormulario({ alEnviar }) {
  const [valores, setValores] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    confirmar: "",
    telefono: "",
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeGeneral, setMensajeGeneral] = useState("");

  const actualizar = (e) => {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: name === "telefono" ? enmascararTelefono(value) : value }));
  };

  // Máscara simple para MX (10 dígitos): (55) 1234 5678
  function enmascararTelefono(v) {
    const d = v.replace(/\D/g, "").slice(0, 10);
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 6);
    const p3 = d.slice(6, 10);
    let out = "";
    if (p1) out = `(${p1}`;
    if (p1 && p1.length === 2) out += ") ";
    if (p2) out += p2;
    if (p3) out += " " + p3;
    return out;
  }

  const validar = () => {
    const e = {};
    if (!valores.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    else if (valores.nombre.trim().length < 2) e.nombre = "Mínimo 2 caracteres.";

    if (!valores.apellidos.trim()) e.apellidos = "Los apellidos son obligatorios.";
    else if (valores.apellidos.trim().length < 2) e.apellidos = "Mínimo 2 caracteres.";

    if (!valores.correo.trim()) e.correo = "El correo es obligatorio.";
    else if (!emailRegex.test(valores.correo.trim())) e.correo = "Correo no válido.";

    if (!valores.contrasena) e.contrasena = "La contraseña es obligatoria.";
    else if (!passRegex.test(valores.contrasena))
      e.contrasena = "Mínimo 8, con mayúscula, minúscula y número.";

    if (!valores.confirmar) e.confirmar = "Confirma tu contraseña.";
    else if (valores.confirmar !== valores.contrasena) e.confirmar = "No coincide con la contraseña.";

 
    if (!valores.telefono)
    {
        e.telefono = "El teléfono es obligatorio.";
    }
     else {
            const soloDigitos = valores.telefono.replace(/\D/g, "");
            if (soloDigitos.length !== 10) 
                {
                    e.telefono = "El teléfono debe tener 10 dígitos.";
                }
}

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeGeneral("");
    if (!validar()) return;

    try {
      setEnviando(true);

      const valoresLimpios = {
        ...valores,
        telefono: valores.telefono.replace(/\D/g, ""),
      };

      if (alEnviar) {
        await alEnviar(valoresLimpios);
      } else {
        // Simulación de éxito
        await new Promise((r) => setTimeout(r, 800));
      }

      setMensajeGeneral("✅ Cuenta creada correctamente.");
      // Limpia campos (opcional)
      setValores({
        nombre: "",
        apellidos: "",
        correo: "",
        contrasena: "",
        confirmar: "",
        telefono: "",
      });
      setErrores({});
    } catch (err) {
      setMensajeGeneral("❌ No se pudo registrar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fondo-gradiente">
      <div className="contenedor-formulario">
        <div className="encabezado">
          <h1 className="titulo">Crear cuenta</h1>
          <p className="subtitulo">Regístrate para continuar</p>
        </div>

        {mensajeGeneral && (
          <div className="mensaje-general">{mensajeGeneral}</div>
        )}

        <form onSubmit={enviar} noValidate>
          <div className="grid-campos">
            <CampoTexto
              etiqueta="Nombre"
              nombre="nombre"
              valor={valores.nombre}
              onCambio={actualizar}
              placeholder="Ej. Juan"
              error={errores.nombre}
              autoComplete="given-name"
            />
            <CampoTexto
              etiqueta="Apellidos"
              nombre="apellidos"
              valor={valores.apellidos}
              onCambio={actualizar}
              placeholder="Ej. Pérez Gómez"
              error={errores.apellidos}
              autoComplete="family-name"
            />
            <CampoTexto
              etiqueta="Correo electrónico"
              nombre="correo"
              tipo="email"
              valor={valores.correo}
              onCambio={actualizar}
              placeholder="tucorreo@dominio.com"
              error={errores.correo}
              autoComplete="email"
            />
            <CampoContrasena
              etiqueta="Contraseña"
              nombre="contrasena"
              valor={valores.contrasena}
              onCambio={actualizar}
              placeholder="••••••••"
              error={errores.contrasena}
            />
            <CampoContrasena
              etiqueta="Confirmar contraseña"
              nombre="confirmar"
              valor={valores.confirmar}
              onCambio={actualizar}
              placeholder="••••••••"
              error={errores.confirmar}
            />
            <CampoTexto
              etiqueta="Teléfono móvil "
              nombre="telefono"
              valor={valores.telefono}
              onCambio={actualizar}
              placeholder="(55) 1234 5678"
              error={errores.telefono}
              autoComplete="tel"
            />
          </div>

          <button className="boton-principal" type="submit" disabled={enviando}>
            {enviando ? "Procesando..." : "Crear cuenta"}
          </button>

          <p className="nota-legal">
            Al registrarte aceptas nuestros Términos y el Aviso de Privacidad.
          </p>
        </form>
      </div>
    </div>
  );
}
