import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const EmpresaLogin = () => {
  const { empresaId } = useParams();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [empresa, setEmpresa] = useState<{ nombre: string; logotipoUrl?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtiene los datos de la empresa
    fetch(`http://localhost:5214/api/empresas/${empresaId}`)
      .then(res => res.json())
      .then(data => setEmpresa(data))
      .catch(() => setEmpresa(null));
  }, [empresaId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5214/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: usuario,
        password: password,
        empresaId: Number(empresaId),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      if (data.Rol === "estudiante") {
        navigate(`/empresas/${empresaId}/estudiante`);
      } else if (data.Rol === "admin") {
        navigate(`/empresas/${empresaId}/dashboard`);
      } else {
        navigate(`/empresas/${empresaId}/dashboard`);
      }
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col items-center"
      >
        {empresa && empresa.logotipoUrl && (
          <img
            src={empresa.logotipoUrl.startsWith("http") ? empresa.logotipoUrl : `http://localhost:5214${empresa.logotipoUrl}`}
            alt="Logo de la empresa"
            className="w-24 h-24 object-contain mb-4 rounded-xl shadow"
          />
        )}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login {empresa ? empresa.nombre : "Empresa"}
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
          type="submit"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default EmpresaLogin;