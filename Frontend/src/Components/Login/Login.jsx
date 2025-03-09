import "./Login.css";
import { useAuth } from "../../auth/auth";
import api from "../../api/axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  //console.log("useAuth:"+useAuth())
  const navigate = useNavigate(); // se crea una constante para llamar a la funcion y luego llamar a la constante como funcion xd
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //console.log("email:",email)
      //console.log("password:",password)
      const response = await api.post(
        "/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(response)
      const data = await response.data;
      //console.log(data)
      if (data.token) {
        // Si obtienes un token, lo guardas y rediriges
        login(data.token);
        console.log("email:", email);

        navigate("/calendario"); // Redirige al calendario
      } else {
        // Manejo de error si el login falla
        alert("Credenciales inválidas");
      }
      Swal.fire({
        title: "Bienvenido",
        text: "Has iniciado sesion " /*+response.data.token*/,
        icon: "success",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "A ocurrido un error, vuelva a intentar",
      });
      //setError("error en las credenciales, intente nuevamente");
    }
  };

  return (
    <>
      <div className="fondo">
        <form onSubmit={handleLogin}>
          <div className="contenedor">
            <h1 className="titulo display-5">Iniciar Sesión</h1>
            {error && <p>{error}</p>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control formulario"
              placeholder="Email"
              aria-label="email"
            ></input>
            <div class="input-group mb-3">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control formulario"
                placeholder="Clave"
                aria-label="Clave"
              ></input>
              <div
                class="input-group-prepend"
                onClick={() => {
                  setShowPass((prev) => !prev);
                }}
                style={{ cursor: "pointer" }}
              >
                <span class="input-group-text" id="basic-addon1">
                  {showPass ? (
                    <i class="bi bi-eye"></i>
                  ) : (
                    <i class="bi bi-eye-slash"></i>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-secondary mt-4 boton"
            >
              Ingresar
            </button>
            <p>¿No estas registrado?</p>
            <a href={"/tesis/#/Registro"}>Registrate</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
