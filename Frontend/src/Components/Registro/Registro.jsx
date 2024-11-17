import './Registro.css'
import api from '../../api/axios'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Registro=()=>{
    const [nombre,setNombre]=useState('');
    const [especialidad,setEspecialidad]=useState('');
    const [telefono,setTelefono]=useState('');
    const [direccion,setDireccion]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [rol,setRol]=useState("Paciente");
    const [rut,setRut]=useState('');
    const [fechaNacimiento,setFechaNacimiento]=useState('');
    const [gradoDependencia,setGradoDependencia]=useState('');
    const visible=true;
    const [esEspecialista,setEsEspecialista]=useState(false);
    const navigate=useNavigate();
    const handleRegistro=async(e)=>{
        e.preventDefault();
        
        if (!validar()) return;
        try{
            const response=await api.post('/usuario',{nombre,especialidad,telefono,direccion,email,password,rol,rut,fechaNacimiento,gradoDependencia,visible});
            Swal.fire({
                title: "Bienvenido",
                text: "Te has registrado correctamente",
                icon: "success"
            });
            navigate('/calendario');
        }catch(err){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "A ocurrido un error, vuelva a intentar",
            });
        }
    }    
const handlerChecked=async(e)=>{
    //e.preventDefault();
    //console.log(e.target.checked)
    //if (!validar()) return;
    const seleccion=e.target.checked
    try{
        setEsEspecialista(seleccion);
        if(seleccion){
            setRol("Especialista");
            setGradoDependencia(null);
            
        }else{
            setRol("Paciente");
            setEspecialidad(null);
        }
    }catch(err){
        console.log("algo salio mal");
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "A ocurrido un error, vuelva a intentar",
        });
    }
}
const validar = () => {
    if (!nombre || !telefono || !direccion || !email || !password || !rut || !fechaNacimiento || (esEspecialista && !especialidad) || (!esEspecialista && !gradoDependencia)) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
        });
        return false;
    }
    return true;
};


return(
    <>
    <div className='fondo'>
        <form onSubmit={handleRegistro} className='contenedor'>
            <h1  className="titulo display-5">Registro</h1>
            <input required={true} className='form-control' type="text"value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder='Nombre'></input>
            <input className='form-control' type="" value={telefono} onChange={(e)=>setTelefono(e.target.value)} placeholder='Telefono'></input>
            <input className='form-control' type="text"value={direccion} onChange={(e)=>setDireccion(e.target.value)} placeholder='Direccion'></input>
            <input className='form-control' type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email'></input>
            <input className='form-control' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password'></input>
            <input className='form-control' type='text' value={rut} onChange={(e)=>setRut(e.target.value)} placeholder='Rut'></input>
            <input className='form-control' type='date' value={fechaNacimiento} onChange={(e)=>setFechaNacimiento(e.target.value)} placeholder='Fecha Nacimiento'></input>
            
            {!esEspecialista&&(
                <input className='form-control' type='text' value={gradoDependencia} onChange={(e)=>setGradoDependencia(e.target.value)} placeholder='Grado Dependencia'></input>
                
            )}
            
            {esEspecialista &&
            (
                <input className='form-control' type='text' value={especialidad} onChange={(e)=>setEspecialidad(e.target.value)} placeholder='Especialidad'></input>
            )
            }
            <div className='check'>
            <input className='checkbox'  type="checkbox" value={esEspecialista}  onClick={handlerChecked}  ></input><p>Especialista</p>
            </div>
            <button className='btn btn-secondary mt-4 boton' type='submit'>Guardar</button>
        </form>
    </div>
    </>
)
}
export default Registro;