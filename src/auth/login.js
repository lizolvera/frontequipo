"use client";

import { useState } from "react";

// --- CONSTANTES Y CONFIGURACIÓN ---
const STEPS = {
  INITIAL_CHOICE: "initial_choice",
  CREDENTIALS: "credentials",
  VERIFICATION: "verification",
  SUCCESS: "success",
};

const API_BASE_URL = "http://localhost:4000/api/authentication";

// --- COMPONENTE DE ICONO DEL LOGO ---
const BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
    <path d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"></path>
  </svg>
);

// --- COMPONENTE PRINCIPAL ---
export default function LoginFormulario() {
  const [step, setStep] = useState(STEPS.INITIAL_CHOICE);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const clearStateForNewStep = () => {
    setError("");
    setIsLoading(false);
  };

  // --- LÓGICA DE API Y MANEJO DE ESTADOS (sin cambios) ---
  const handleCredentialsSubmit = async (e) => { e.preventDefault(); clearStateForNewStep(); if (!email || password.length < 6) { setError("Por favor, ingresa un correo y una contraseña de al menos 6 caracteres."); return; } setIsLoading(true); try { const response = await fetch(`${API_BASE_URL}/login/step1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); if (!response.ok) throw new Error("Credenciales inválidas. Por favor, verifica tu correo y contraseña."); const data = await response.json(); setUserId(data.userId); setStep(STEPS.VERIFICATION); } catch (err) { if (err instanceof TypeError && err.message === 'Failed to fetch') setError("Error de conexión con el servidor. Por favor, inténtalo más tarde."); else setError(err.message || "Ocurrió un error inesperado."); } finally { setIsLoading(false); } };
  const handleVerificationSubmit = async (e) => { e.preventDefault(); clearStateForNewStep(); if (verificationCode.length !== 6) { setError("El código de verificación debe tener 6 dígitos."); return; } setIsLoading(true); try { const response = await fetch(`${API_BASE_URL}/login/step2`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, code: verificationCode }) }); if (!response.ok) throw new Error("El código es incorrecto o ha expirado. Intenta de nuevo."); setStep(STEPS.SUCCESS); } catch (err) { if (err instanceof TypeError && err.message === 'Failed to fetch') setError("Error de conexión con el servidor. Por favor, inténtalo más tarde."); else setError(err.message || "Ocurrió un error durante la verificación."); } finally { setIsLoading(false); } };
  const handleGoBack = () => { clearStateForNewStep(); setStep(STEPS.CREDENTIALS); };
  const handleGoToChoice = () => { clearStateForNewStep(); setStep(STEPS.INITIAL_CHOICE); };

  // --- RENDERIZADO DE PASOS (sin cambios en la lógica interna) ---
  const renderInitialChoiceStep = () => (<> <div className="text-center"> <h1 className="text-2xl font-bold text-white">Inicia sesión en la aplicación</h1> <p className="mt-2 text-sm text-gray-400">Elige la mejor forma de acceder a tu cuenta.</p> </div> <div className="mt-8 space-y-4"> <button disabled={isLoading} className="w-full py-3 font-semibold text-white bg-white/10 rounded-lg transition-all duration-300 hover:bg-white/20 disabled:opacity-50 flex items-center justify-center border border-white/20" onClick={() => setError("Funcionalidad no implementada.")}> <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.26H12v4.32h6.05c-.24 1.25-.9 2.37-1.92 3.19v2.85h3.66c2.15-1.98 3.44-4.75 3.44-8.08z" fill="#4285F4" /><path d="M12 23c3.15 0 5.8-1.03 7.73-2.82l-3.66-2.85c-1.02.73-2.31 1.16-4.07 1.16-3.13 0-5.78-2.11-6.75-4.9H1.58v3.02C3.47 20.73 7.42 23 12 23z" fill="#34A853" /><path d="M5.25 14.16c-.23-.68-.36-1.42-.36-2.16s.13-1.48.36-2.16V6.82H1.58c-.52.95-.82 2.05-.82 3.18 0 1.13.3 2.23.82 3.18L5.25 14.16z" fill="#FBBC05" /><path d="M12 5.09c1.64 0 3.1.57 4.25 1.63l3.23-3.17C17.8 2.36 15.15 1 12 1c-4.58 0-8.53 2.27-10.42 5.82L5.25 9.84C6.22 7.08 8.87 5.09 12 5.09z" fill="#EA4335" /></svg> Continuar con Google </button> <div className="flex items-center space-x-2 my-6"><div className="flex-grow border-t border-gray-700"></div><span className="text-xs text-gray-500 uppercase">O</span><div className="flex-grow border-t border-gray-700"></div></div> <button onClick={() => setStep(STEPS.CREDENTIALS)} disabled={isLoading} className="w-full py-3 font-semibold text-black bg-white rounded-lg transition-all duration-300 hover:bg-gray-200 disabled:opacity-50"> Continuar con Correo Electrónico </button> </div> </>);
  const renderCredentialsStep = () => (<> <button onClick={handleGoToChoice} className="text-sm text-gray-400 hover:text-white mb-6 flex items-center transition-colors"> <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Cambiar método </button> <div className="text-center"> <h1 className="text-2xl font-bold text-white">¡Bienvenido de nuevo!</h1> <p className="mt-2 text-sm text-gray-400">Ingresa tus credenciales para continuar.</p> </div> <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-4"> <input type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-150 border border-transparent hover:border-white/20" autoComplete="email" /> <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-150 border border-transparent hover:border-white/20" autoComplete="current-password" /> <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-black bg-white rounded-lg transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 mt-6"> {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'} </button> </form> </>);
  const renderVerificationStep = () => (<> <div className="text-center"> <h1 className="text-2xl font-bold text-white">Revisa tu correo</h1> <p className="mt-2 text-sm text-gray-400">Enviamos un código de 6 dígitos a <span className="font-medium text-white">{email}</span></p> </div> <form onSubmit={handleVerificationSubmit} className="mt-8 space-y-4"> <input type="text" placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))} disabled={isLoading} maxLength={6} className="w-full px-4 py-3 text-2xl tracking-[0.5em] text-center bg-white/10 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-150" autoFocus /> <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-black bg-white rounded-lg transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 mt-6"> {isLoading ? 'Verificando...' : 'Verificar'} </button> </form> <button onClick={handleGoBack} disabled={isLoading} className="w-full mt-4 text-sm text-gray-400 hover:text-white transition duration-150">Regresar</button> </>);
  const renderSuccessStep = () => (<div className="text-center p-4"> <h1 className="text-3xl font-extrabold text-white mb-2">¡Autenticación Exitosa!</h1> <p className="mt-2 text-md text-green-400">Redirigiendo a tu panel...</p> </div>);
  const renderStepContent = () => { switch (step) { case STEPS.INITIAL_CHOICE: return renderInitialChoiceStep(); case STEPS.VERIFICATION: return renderVerificationStep(); case STEPS.SUCCESS: return renderSuccessStep(); case STEPS.CREDENTIALS: default: return renderCredentialsStep(); } };

  return (
    <>
      <style jsx global>{`
        body {
          background: radial-gradient(1400px 700px at 15% -15%, #2a2d3e 0%, transparent 65%),
                      radial-gradient(1000px 600px at 115% 5%, #6b2fa0 0%, transparent 60%),
                      radial-gradient(800px 400px at 50% 100%, #1a1d2e 0%, transparent 50%),
                      linear-gradient(180deg, #0a0c12 0%, #12141f 100%);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-white">

        {/* --- Columna Izquierda: Contenido del Formulario --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
              <BrandIcon className="w-12 h-12 text-gray-500" />
            </div>

            {error && (
              <div className="mb-4 p-3 text-center text-sm font-medium text-white bg-red-700/50 rounded-lg border border-red-500">
                {error}
              </div>
            )}

            <div key={step} className="animate-fade-in">
              {renderStepContent()}
            </div>

            <footer className="text-center mt-8 text-xs text-gray-400">
              <p>
                Al continuar, aceptas nuestros{' '}
                <a href="#" className="underline hover:text-white">Términos de Servicio</a> y <a href="#" className="underline hover:text-white">Política de Privacidad</a>.
              </p>
            </footer>
          </div>
        </div>

        {/* --- Columna Derecha: Imagen --- */}
        <div className="hidden lg:flex lg:w-1/2 h-screen">
          <img
            src="unnamed.jpg"
            alt="Fondo decorativo abstracto"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}