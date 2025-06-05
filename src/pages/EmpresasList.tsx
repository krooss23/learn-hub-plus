import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlagIcon, MapPinIcon, BuildingOffice2Icon, PencilIcon, LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Empresa {
  id: number;
  nombre: string;
  pais: string;
  region: string;
  zona: string;
  textoBienvenida: string;
  activo: boolean;
}

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroPais, setFiltroPais] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState<Empresa | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5214/api/empresas")
      .then(res => res.json())
      .then(setEmpresas);
  }, []);

  // Obtener valores únicos para los selects
  const paises = Array.from(new Set(empresas.map(e => e.pais))).filter(Boolean);
  const regiones = Array.from(new Set(empresas.map(e => e.region))).filter(Boolean);
  const zonas = Array.from(new Set(empresas.map(e => e.zona))).filter(Boolean);

  // Filtrar empresas según los filtros seleccionados
  const empresasFiltradas = empresas.filter(e =>
    (filtroPais ? e.pais === filtroPais : true) &&
    (filtroRegion ? e.region === filtroRegion : true) &&
    (filtroZona ? e.zona === filtroZona : true)
  );

  const handleEdit = (empresa: Empresa) => {
    setEmpresaEdit(empresa);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Aquí deberías hacer el fetch/put/patch a la API
    setShowEditModal(false);
    setEmpresaEdit(null);
    // Actualiza la lista si es necesario
  };

  return (
    <div className="p-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar empresas..."
            className="w-full md:w-1/2 border rounded px-3 py-2 text-sm"
            // Si quieres implementar búsqueda, agrega el estado y lógica aquí
          />
          <div className="flex gap-2 w-full md:w-auto md:ml-auto">
            <button
              className="border border-primary text-primary px-4 py-2 rounded transition hover:bg-primary hover:text-white whitespace-nowrap"
              onClick={() => {
                setFiltroPais("");
                setFiltroRegion("");
                setFiltroZona("");
                // Si agregas búsqueda, resetea aquí también
              }}
            >
              Limpiar filtros
            </button>
            <button
              className="bg-primary text-white px-4 py-2 rounded shadow transition hover:scale-105 hover:bg-primary/90 whitespace-nowrap"
              onClick={() => navigate("/empresas/nueva")}
            >
              Crear empresa
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* País */}
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <FlagIcon className="w-5 h-5 text-gray-400" />
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={filtroPais}
              onChange={e => setFiltroPais(e.target.value)}
            >
              <option value="">Todos los países</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
          {/* Región */}
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <MapPinIcon className="w-5 h-5 text-gray-400" />
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={filtroRegion}
              onChange={e => setFiltroRegion(e.target.value)}
            >
              <option value="">Todas las regiones</option>
              {regiones.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          {/* Zona */}
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <MapPinIcon className="w-5 h-5 text-gray-400" />
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={filtroZona}
              onChange={e => setFiltroZona(e.target.value)}
            >
              <option value="">Todas las zonas</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>{zona}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Encabezado y botón */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Empresas</h2>
        
      </div>
      {/* Lista de empresas filtradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresasFiltradas.map(e => (
          <div
            key={e.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-2 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-sm">
                  {e.nombre
                    .split(" ")
                    .map(w => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{e.nombre}</div>
                  <div className="text-xs text-gray-500">{e.pais}</div>
                  <div className="text-gray-700 text-sm mt-1 line-clamp-2">{e.textoBienvenida}</div>
                  <span className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${e.activo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                    {e.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {/* Editar */}
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-100 text-yellow-800 shadow-sm hover:bg-yellow-200 transition-all duration-150 active:scale-95"
                  title="Editar"
                  onClick={() => handleEdit(e)}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {/* Link público */}
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200 transition-all duration-150 active:scale-95"
                  title="Link público"
                  onClick={() => window.open(`/empresas/${e.id}/public`, "_blank")}
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                {/* Borrar */}
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-100 text-red-800 shadow-sm hover:bg-red-200 transition-all duration-150 active:scale-95"
                  title="Borrar"
                  onClick={() => {/* tu lógica de borrado aquí */}}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {showEditModal && empresaEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowEditModal(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Editar empresa</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className="border rounded px-3 py-2"
                value={empresaEdit.nombre}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, nombre: ev.target.value })}
                placeholder="Nombre"
              />
              <input
                className="border rounded px-3 py-2"
                value={empresaEdit.textoBienvenida}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, textoBienvenida: ev.target.value })}
                placeholder="Texto de bienvenida"
              />
              {/* Agrega más campos según tu modelo */}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}