import logo from './logo.svg';
//import './App.css';
import "./Style/formulario.css";
import RegistroFormulario from "./ForRegistro/Registroformulario"
import { registrarUsuario } from "./Servicios/autenticacion";

function App() {
  
 return <RegistroFormulario alEnviar={registrarUsuario} />;
 
}

export default App;
