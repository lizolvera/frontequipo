import login from './logo.svg';
import "./Style/formulario.css";
// Importa el componente de Registro
import RegistroFormulario from "./ForRegistro/RegistroFormulario";
import RegistroPage   from "./ForRegistro/RegistroPage";
// Importa el componente de Login
import LoginFormulario from "./auth/login";

// Importa los componentes de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        // 1. Envuelve la app en BrowserRouter
        <BrowserRouter> 
            <Routes>
                {/* 2. Define la ruta para la URL / */}
                <Route path="/" element={<RegistroPage   />} /> 
                
                {/* 3. Define la ruta para la URL /login */}
                <Route path="/login" element={<LoginFormulario />} /> 

                {/* Puedes añadir más rutas aquí, como /home, /dashboard, etc. */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;