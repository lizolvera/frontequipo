import React, { useState } from 'react';
import RegistroFormulario from './Registroformulario';

const API_BASE_URL = 'http://localhost:4000/api/usuarios';

export default function RegistroPage() {
    const [estadoGlobal, setEstadoGlobal] = useState('inicial');
    const [tempToken, setTempToken] = useState(null); // Guardar tempToken entre pasos

    /**
     * PASO 1: Solo validar y enviar código 2FA (NO registrar todavía)
     */
    const handleEnviarRegistro = async (datos) => {
        console.log("Datos enviados para validación:", datos);
        
        try {
            const response = await fetch(`${API_BASE_URL}/registrar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('El servidor devolvió HTML:', textResponse.substring(0, 200));
                throw new Error('Error del servidor: Respuesta no es JSON. Verifica que la API esté funcionando.');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                let mensajeError = errorData.error || `Error ${response.status}: ${response.statusText}`;

                if (errorData.errors) {
                    const camposFaltantes = Object.keys(errorData.errors)
                        .map(key => errorData.errors[key].path || key)
                        .join(', ');
                    mensajeError = `Faltan campos requeridos: ${camposFaltantes}.`;
                } else if (errorData.message) {
                    mensajeError = errorData.message;
                }

                throw new Error(mensajeError);
            }

            const res = await response.json();
            
            // El backend ahora devuelve requires2fa: true siempre en este punto
            if (res.requires2fa) {
                // Guardar el tempToken para usarlo en la verificación
                setTempToken(res.tempToken);
                return res; // Esto activará el formulario 2FA en RegistroFormulario
            }

            // Este caso no debería ocurrir con el nuevo flujo
            throw new Error("Flujo inesperado del servidor");
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('JSON')) {
                throw new Error('Error de conexión con el servidor. Verifica que el backend esté ejecutándose en puerto 4000.');
            }
            throw error;
        }
    };

    /**
     * PASO 2: Verificar código 2FA y completar registro
     */
    const handleVerificar2FA = async (tempToken, codigo) => {
        console.log(`Verificando código: ${codigo} con token: ${tempToken}`);
        
        try {
            const response = await fetch(`${API_BASE_URL}/register/2fa/verificar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken, codigo }),
            });
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('El servidor devolvió HTML:', textResponse.substring(0, 200));
                throw new Error('Error del servidor: Respuesta no es JSON.');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Código de verificación incorrecto.');
            }

            const result = await response.json();
            
            // ✅ Verificación exitosa - Ahora el usuario está registrado en BD
            setEstadoGlobal('registro_completado');
            console.log('Verificación 2FA completa. Usuario registrado en BD.');
            
            return result;
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('JSON')) {
                throw new Error('Error de conexión con el servidor de verificación.');
            }
            throw error;
        }
    };

    /**
     * PASO 3: Reenviar código 2FA
     */
    const handleReenviar2FA = async (tempToken) => {
        console.log(`Solicitando reenvío de código para token: ${tempToken}`);
        
        try {
            const response = await fetch(`${API_BASE_URL}/register/2fa/reenviar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken }),
            });
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('El servidor devolvió HTML:', textResponse.substring(0, 200));
                throw new Error('Error del servidor: No se pudo reenviar el código.');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'No se pudo reenviar el código.');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('JSON')) {
                throw new Error('Error de conexión con el servidor.');
            }
            throw error;
        }
    };

    // Pantalla de Éxito después de verificación 2FA
    if (estadoGlobal === 'registro_completado') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white shadow-xl rounded-lg text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">¡Registro Exitoso!</h2>
                    <p className="text-gray-700 mb-2">Tu cuenta ha sido verificada y creada correctamente.</p>
                    <p className="text-gray-600 text-sm mb-6">Ya puedes iniciar sesión con tus credenciales.</p>
                    <button 
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full"
                        onClick={() => window.location.href = '/login'}
                    >
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }
    
    // Renderiza el formulario y le pasa las funciones de la API
    return (
        <RegistroFormulario 
            alEnviar={handleEnviarRegistro} 
            alVerificar={handleVerificar2FA} 
            alReenviar={handleReenviar2FA} 
        />
    );
}