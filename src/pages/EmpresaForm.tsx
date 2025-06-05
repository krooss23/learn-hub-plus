import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: "",
    pais: "",
    textoBienvenida: "",
    logotipo: null as File | null,
    imagenFondoLogin: null as File | null,
    imagenHeader: null as File | null,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });
    await fetch("http://localhost:5214/api/empresas", {
      method: "POST",
      body: data,
    });
    navigate("/empresas");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Empresa</h2>
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            name="nombre"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">País</label>
          <input
            name="pais"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Texto de bienvenida</label>
          <textarea
            name="textoBienvenida"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            rows={3}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Logotipo</label>
          <input type="file" name="logotipo" className="w-full" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Imagen de fondo de login</label>
          <input type="file" name="imagenFondoLogin" className="w-full" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Imagen para header</label>
          <input type="file" name="imagenHeader" className="w-full" onChange={handleChange} />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded shadow transition hover:scale-105 hover:bg-primary/90"
          >
            Guardar
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded shadow transition hover:scale-105"
            onClick={() => navigate("/empresas")}
          >
            Volver al listado
          </button>
        </div>
      </form>
    </div>
  );
}