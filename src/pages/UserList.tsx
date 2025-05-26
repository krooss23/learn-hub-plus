import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ name: "", email: "", role: "todos" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5214/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(filter.name.toLowerCase()) &&
    user.email.toLowerCase().includes(filter.email.toLowerCase()) &&
    (filter.role === "todos" || user.rol === filter.role)
  );

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}" y todos sus datos?`)) {
      fetch(`http://localhost:5214/api/users/${id}`, { method: "DELETE" })
        .then(res => {
          if (res.ok) {
            setUsers(users.filter(u => u.id !== id));
            toast.success("Usuario eliminado", {
              description: "El usuario ha sido eliminado correctamente.",
            });
          } else {
            toast.error("Error al eliminar el usuario");
          }
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  return (
    <Card className="max-w-5xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Usuarios del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Buscar por nombre"
              value={filter.name}
              onChange={e => setFilter({ ...filter, name: e.target.value })}
              className="w-48"
            />
            <Input
              placeholder="Buscar por correo"
              value={filter.email}
              onChange={e => setFilter({ ...filter, email: e.target.value })}
              className="w-48"
            />
            <Select
              value={filter.role}
              onValueChange={role => setFilter({ ...filter, role })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="profesor">Profesor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link to="/new-user">
            <Button
              className="bg-[#181E29] hover:bg-[#232A3A] text-white font-semibold text-base px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Crear Nuevo Usuario
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellidos</th>
                <th className="px-4 py-2 text-left">SenceNet</th>
                <th className="px-4 py-2 text-left">País</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Tipo de Usuario</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.nombre}</td>
                  <td className="px-4 py-2">{user.apellidos}</td>
                  <td className="px-4 py-2">{user.senceNet}</td>
                  <td className="px-4 py-2">{user.pais}</td>
                  <td className="px-4 py-2">{user.estado}</td>
                  <td className="px-4 py-2 capitalize">{user.rol}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user.id)}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id, user.nombre)}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted-foreground">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersList;