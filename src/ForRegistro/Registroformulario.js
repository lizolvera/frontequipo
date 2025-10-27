import React, { useState } from "react";
import CampoTexto from "./CampoTexto"; 
import CampoContrasena from "./Campocontrasena";
import FormularioCodigo2FA from "./FormularioCodigo2FA";
import "../Style/formulario.css";

// Validaciones
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/;

// SOLO el componente RegistroFormulario
export default function Registroformulario({ alEnviar, alVerificar, alReenviar }) {
  const [valores, setValores] = useState({
    nombre: "",
    apellidopaterno: "",
    apellidomaterno: "",
    correo: "",
    contrasena: "",
    confirmar: "",
    telefono: "",
    preguntasecreta: "",
    respuestasecreta: "",
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeGeneral, setMensajeGeneral] = useState("");

  // ==== ESTADO 2FA (registro) ====
  const [otpActivo, setOtpActivo] = useState(false);
  const [otpTempToken, setOtpTempToken] = useState(null);
  const [otpCanal, setOtpCanal] = useState(null);
  const [otpDestino, setOtpDestino] = useState(null);

  const resetFormulario = () => {
    setValores({
      nombre: "",
      apellidopaterno: "",
      apellidomaterno: "",
      correo: "",
      contrasena: "",
      confirmar: "",
      telefono: "",
      preguntasecreta: "",
      respuestasecreta: "",
    });
    setErrores({});
  };

  const actualizar = (e) => {
    const { name, value } = e.target;
    setValores((v) => ({
      ...v,
      [name]: name === "telefono" ? enmascararTelefono(value) : value,
    }));
  };

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
    else if (valores.nombre.trim().length < 2)
      e.nombre = "Mínimo 2 caracteres.";

    if (!valores.apellidopaterno.trim())
      e.apellidopaterno = "El apellido paterno es obligatorio.";
    else if (valores.apellidopaterno.trim().length < 1)
      e.apellidopaterno = "Mínimo 1 caracteres.";

    if (!valores.apellidomaterno.trim())
      e.apellidomaterno = "El apellido materno es obligatorio.";
    else if (valores.apellidomaterno.trim().length < 1)
      e.apellidomaterno = "Mínimo 1 caracteres.";

    if (!valores.correo.trim()) e.correo = "El correo es obligatorio.";
    else if (!emailRegex.test(valores.correo.trim()))
      e.correo = "Correo no válido.";

    if (!valores.contrasena) e.contrasena = "La contraseña es obligatoria.";
    else if (!passRegex.test(valores.contrasena))
      e.contrasena = "Mínimo 8, con mayúscula, minúscula y número.";

    if (!valores.confirmar) e.confirmar = "Confirma tu contraseña.";
    else if (valores.confirmar !== valores.contrasena)
      e.confirmar = "No coincide con la contraseña.";

    if (!valores.telefono) {
      e.telefono = "El teléfono es obligatorio.";
    } else {
      const soloDigitos = valores.telefono.replace(/\D/g, "");
      if (soloDigitos.length !== 10) {
        e.telefono = "El teléfono debe tener 10 dígitos.";
      }
    }

    if (!valores.preguntasecreta) {
      e.preguntasecreta = "Selecciona una pregunta secreta.";
    }

    if (!valores.respuestasecreta.trim()) {
      e.respuestasecreta = "La respuesta secreta es obligatoria.";
    } else if (valores.respuestasecreta.trim().length < 3) {
      e.respuestasecreta = "La respuesta debe tener al menos 3 caracteres.";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeGeneral("");
    
    // VERIFICACIÓN CRÍTICA - asegura que alEnviar existe
    if (!alEnviar || typeof alEnviar !== 'function') {
      setMensajeGeneral("❌ Error: Función alEnviar no disponible");
      return;
    }
    
    if (!validar()) return;

    try {
      setEnviando(true);

      const valoresLimpios = {
        ...valores,
        telefono: valores.telefono.replace(/\D/g, ""), 
      };

      // Llama a la función real de la API - SOLO para validar y enviar código
      const res = await alEnviar(valoresLimpios);

      // CON EL NUEVO FLUJO: siempre debe venir requires2fa: true
      if (res?.requires2fa) {
        setOtpActivo(true);
        setOtpTempToken(res.tempToken);
        setOtpCanal(res.canal);
        setOtpDestino(res.destino);
        setMensajeGeneral("📨 Código de verificación enviado. Revisa tu correo electrónico.");
        return; 
      }

      // Este caso no debería ocurrir con el nuevo flujo
      setMensajeGeneral("❌ Flujo inesperado. Inténtalo de nuevo.");
      
    } catch (err) {
      setMensajeGeneral("❌ " + (err.message || "No se pudo procesar el registro."));
    } finally {
      setEnviando(false);
    }
  };
    
  const handle2FACompletado = () => {
    // CON EL NUEVO FLUJO: Esta función se llama cuando la verificación 2FA es exitosa
    // PERO ahora el registro en BD ya se completó en el backend
    // Solo mostramos mensaje y limpiamos el formulario
    setMensajeGeneral("🎉 ¡Verificación completada! Tu cuenta ha sido creada exitosamente.");
    
    // Limpiamos el formulario después de un breve delay
    setTimeout(() => {
      resetFormulario();
      setOtpActivo(false);
      setOtpTempToken(null);
      setOtpCanal(null);
      setOtpDestino(null);
    }, 3000);
  };
    
  const handle2FACancelar = () => {
    setOtpActivo(false);
    setOtpTempToken(null);
    setOtpCanal(null);
    setOtpDestino(null);
    setMensajeGeneral("⏹️ Verificación cancelada. Puedes intentar registrar nuevamente.");
  };

  // Función para manejar cuando el usuario quiere volver al formulario desde 2FA
  const handleVolverAlFormulario = () => {
    setOtpActivo(false);
    setOtpTempToken(null);
    setOtpCanal(null);
    setOtpDestino(null);
    setMensajeGeneral("↩️ Volviendo al formulario de registro.");
  };

  return (
    <div className="fondo-gradiente">
      <div className="contenedor-formulario">
        <div className="encabezado">
          <h1 className="titulo">Crear cuenta</h1>
          <p className="subtitulo">Regístrate para continuar</p>
        </div>

        {mensajeGeneral && (
          <div className={`mensaje-general ${
            mensajeGeneral.includes("❌") ? "mensaje-error" : 
            mensajeGeneral.includes("🎉") ? "mensaje-exito" : 
            "mensaje-info"
          }`}>
            {mensajeGeneral}
          </div>
        )}

        {!otpActivo ? (
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
                etiqueta="Apellido Paterno"
                nombre="apellidopaterno"
                valor={valores.apellidopaterno}
                onCambio={actualizar}
                placeholder="Ej. Pérez"
                error={errores.apellidopaterno}
                autoComplete="family-name"
              />
              <CampoTexto
                etiqueta="Apellido Materno"
                nombre="apellidomaterno"
                valor={valores.apellidomaterno}
                onCambio={actualizar}
                placeholder="Ej. Gómez"
                error={errores.apellidomaterno}
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
                etiqueta="Teléfono móvil"
                nombre="telefono"
                valor={valores.telefono}
                onCambio={actualizar}
                placeholder="(55) 1234 5678"
                error={errores.telefono}
                autoComplete="tel"
              />

              <CampoTexto
                etiqueta="Pregunta secreta"
                nombre="preguntasecreta"
                tipo="select"
                valor={valores.preguntasecreta}
                onCambio={actualizar}
                placeholder="Selecciona tu pregunta…"
                error={errores.preguntasecreta}
                opciones={[
                  "¿Nombre de tu primera mascota?",
                  "¿Ciudad donde naciste?",
                  "¿Segundo nombre de tu madre?",
                  "¿Comida favorita de tu infancia?",
                  "¿Nombre de tu mejor amigo(a) de la infancia?",
                ]}
              />

              <CampoContrasena
                etiqueta="Respuesta secreta"
                nombre="respuestasecreta"
                valor={valores.respuestasecreta}
                onCambio={actualizar}
                placeholder="Tu respuesta"
                error={errores.respuestasecreta}
              />
            </div>

            <button className="boton-principal" type="submit" disabled={enviando}>
              {enviando ? "Enviando código..." : "Crear cuenta"}
            </button>

            <p className="nota-legal">
              Al registrarte aceptas nuestros Términos y el Aviso de Privacidad.
            </p>
          </form>
        ) : (
          <FormularioCodigo2FA
            tempToken={otpTempToken}
            canal={otpCanal}
            destinoEnmascarado={otpDestino}
            alVerificar={alVerificar}
            alReenviar={alReenviar}
            onCompletado={handle2FACompletado}
            onCancelar={handle2FACancelar}
            onVolver={handleVolverAlFormulario}
          />
        )}
      </div>
    </div>
  );
}