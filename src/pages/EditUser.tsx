import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

const ROLES = ["estudiante", "profesor", "admin"];
const PAISES = ["Chile", "Argentina", "Perú", "México", "Colombia"];
const ESTADOS = ["activo", "inactivo", "pendiente"];

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5214/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5214/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5214/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el usuario");
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Cambios realizados con éxito",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/usuarios");
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error al guardar los cambios",
          text: "Intenta nuevamente.",
        });
      });
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 rounded-lg shadow-lg p-8 w-full max-w-2xl space-y-4 transition-shadow duration-300 hover:shadow-2xl"
          style={{
            boxShadow: "0 4px 24px 0 rgba(12,20,36,0.08)",
            animation: "fadeIn 0.7s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px);}
                to { opacity: 1; transform: translateY(0);}
              }
              input, select {
                transition: box-shadow 0.2s, border-color 0.2s;
              }
              input:focus, select:focus {
                box-shadow: 0 0 0 2px #0c142422;
                border-color: #0c1424;
              }
            `}
          </style>
          <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input name="nombre" value={user.nombre} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input name="apellidos" value={user.apellidos} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="senceNet">SenceNet</Label>
            <Input name="senceNet" value={user.senceNet} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="pais">País</Label>
            <select
              name="pais"
              value={user.pais}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none"
              required
            >
              <option value="">Selecciona un país</option>
              {PAISES.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <select
              name="estado"
              value={user.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none"
              required
            >
              <option value="">Selecciona un estado</option>
              {ESTADOS.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input name="email" value={user.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="rol">Rol</Label>
            <select
              name="rol"
              value={user.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none"
              required
            >
              <option value="">Selecciona un rol</option>
              {ROLES.map(rol => (
                <option key={rol} value={rol}>{rol.charAt(0).toUpperCase() + rol.slice(1)}</option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="w-full font-bold text-white transition hover:scale-[1.02]"
            style={{
              background: "#0c1424",
              color: "#fff",
              fontSize: "1.2rem"
            }}
          >
            Guardar Cambios
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditUser;