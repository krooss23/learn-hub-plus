import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: "",
    pais: "",
    region: "",
    zona: "",
    textoBienvenida: "",
    logotipo: null as File | null,
    imagenFondoLogin: null as File | null,
    imagenHeader: null as File | null,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Incluye region y zona en el body
    const { nombre, pais, region, zona, textoBienvenida } = form;
    const response = await fetch('http://localhost:5214/api/empresas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, pais, region, zona, textoBienvenida }),
    });
    if (response.ok) {
      const nuevaEmpresa = await response.json();
      navigate(`/empresas/${nuevaEmpresa.id}/public`);
    }
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
          <select
            name="pais"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
            value={form.pais}
            onChange={handleChange}
          >
            <option value="">Selecciona un país</option>
            <option value="Chile">Chile</option>
            <option value="Argentina">Argentina</option>
            <option value="Perú">Perú</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
            {/* Agrega más países si lo deseas */}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Región</label>
          <input
            name="region"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={form.region}
            onChange={handleChange}
            placeholder="Región"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Zona</label>
          <input
            name="zona"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={form.zona}
            onChange={handleChange}
            placeholder="Zona"
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