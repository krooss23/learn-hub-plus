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
  logotipoUrl?: string; // Agregado para la URL del logotipo
}

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroPais, setFiltroPais] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState<Empresa | null>(null);
  const [allPaises, setAllPaises] = useState<string[]>([]);
  const [allRegiones, setAllRegiones] = useState<string[]>([]);
  const [allZonas, setAllZonas] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchEmpresas = async () => {
    const res = await fetch('http://localhost:5214/api/empresas');
    const data = await res.json();
    setEmpresas(data);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Carga todos los países al montar
  useEffect(() => {
    fetch("http://localhost:5214/api/regiones")
      .then(res => res.json())
      .then(setAllPaises);
  }, []);

  // Carga regiones y zonas cuando cambie el país seleccionado en el modal
  useEffect(() => {
    if (empresaEdit?.pais) {
      fetch(`http://localhost:5214/api/regiones/${empresaEdit.pais}`)
        .then(res => res.json())
        .then(setAllRegiones);

      fetch(`http://localhost:5214/api/regiones/${empresaEdit.pais}/zonas`)
        .then(res => res.json())
        .then(data => {
          // Si data es un objeto, conviértelo a array de claves (zonas)
          if (data && typeof data === "object" && !Array.isArray(data)) {
            setAllZonas(Object.keys(data));
          } else if (Array.isArray(data)) {
            setAllZonas(data);
          } else {
            setAllZonas([]);
          }
        });
    } else {
      setAllRegiones([]);
      setAllZonas([]);
    }
  }, [empresaEdit?.pais]);

  // Agrega este useEffect para seleccionar automáticamente la zona al cambiar la región en el modal de edición
  useEffect(() => {
    if (empresaEdit?.region && allZonas.length > 0) {
      // Si la región coincide con una zona, selecciónala automáticamente
      if (allZonas.includes(empresaEdit.region)) {
        setEmpresaEdit(edit => edit ? { ...edit, zona: edit.region } : edit);
      }
      // Si no, selecciona la primera zona disponible si no hay zona seleccionada
      else if (!empresaEdit.zona) {
        setEmpresaEdit(edit => edit ? { ...edit, zona: allZonas[0] } : edit);
      }
    }
    // Limpia la zona si no hay región seleccionada
    if (!empresaEdit?.region) {
      setEmpresaEdit(edit => edit ? { ...edit, zona: "" } : edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaEdit?.region, allZonas]);

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

  const handleSaveEdit = async () => {
    if (!empresaEdit) return;
    const formData = new FormData();
    formData.append("Nombre", empresaEdit.nombre);
    formData.append("Pais", empresaEdit.pais);
    formData.append("Region", empresaEdit.region);
    formData.append("Zona", empresaEdit.zona);
    formData.append("TextoBienvenida", empresaEdit.textoBienvenida);
    formData.append("Activo", empresaEdit.activo ? "true" : "false");
    if ((empresaEdit as any).logotipo) {
      formData.append("Logotipo", (empresaEdit as any).logotipo);
    }

    await fetch(`http://localhost:5214/api/empresas/${empresaEdit.id}`, {
      method: 'PUT',
      body: formData,
      // No pongas headers, el navegador los pone automáticamente para FormData
    });

    setShowEditModal(false);
    setEmpresaEdit(null);
    fetchEmpresas();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta empresa?")) return;
    await fetch(`http://localhost:5214/api/empresas/${id}`, {
      method: "DELETE",
    });
    fetchEmpresas(); // Recarga la lista después de borrar
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
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex items-center gap-5 border border-gray-100"
          >
            {/* Logo grande a la izquierda */}
            <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-full border border-gray-200 shadow" style={{ width: 96, height: 96 }}>
              {e.logotipoUrl ? (
                <img
                  src={`http://localhost:5214${e.logotipoUrl}`}
                  alt={e.nombre}
                  className="object-contain"
                  style={{ width: 88, height: 88 }}
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-4xl font-bold text-gray-500">
                  {e.nombre[0]}
                </div>
              )}
            </div>
            {/* Info y acciones */}
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-xl text-gray-900">{e.nombre}</div>
                  <div className="text-sm text-gray-500">{e.pais}</div>
                  <div className="text-base text-gray-700 mt-1">{e.textoBienvenida}</div>
                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${e.activo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                    {e.activo ? "Activo" : "Inactivo"}
                  </span>
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
                  {/* Link público (no hace nada) */}
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200 transition-all duration-150 active:scale-95"
                    title="Link público"
                    onClick={() => {}} // No hace nada
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  {/* Borrar */}
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-100 text-red-800 shadow-sm hover:bg-red-200 transition-all duration-150 active:scale-95"
                    title="Borrar"
                    onClick={() => handleDelete(e.id)}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  {/* Botón Home (abre link público) */}
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition-all duration-150 active:scale-95"
                    title="Ir al inicio"
                    onClick={() => window.open(`/empresas/${e.id}/public`, "_blank")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
                    </svg>
                  </button>
                </div>
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
                required
              />
              <select
                className="border rounded px-3 py-2"
                value={empresaEdit.pais || ""}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, pais: ev.target.value, region: "", zona: "" })}
                required
              >
                <option value="">Selecciona un país</option>
                {allPaises.map(pais => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2"
                value={empresaEdit.region || ""}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, region: ev.target.value, zona: "" })}
                required
              >
                <option value="">Selecciona una región</option>
                {allRegiones.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2"
                value={empresaEdit.zona || ""}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, zona: ev.target.value })}
                required
              >
                <option value="">Selecciona una zona</option>
                {allZonas.map(zona => (
                  <option key={zona} value={zona}>{zona}</option>
                ))}
              </select>
              <textarea
                className="border rounded px-3 py-2"
                value={empresaEdit.textoBienvenida || ""}
                onChange={ev => setEmpresaEdit({ ...empresaEdit, textoBienvenida: ev.target.value })}
                placeholder="Texto de bienvenida"
                rows={3}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={empresaEdit.activo}
                  onChange={ev => setEmpresaEdit({ ...empresaEdit, activo: ev.target.checked })}
                />
                Activo
              </label>
              <label className="flex flex-col gap-1">
                Logotipo
                <input
                  type="file"
                  accept="image/*"
                  onChange={ev => {
                    const file = ev.target.files?.[0] || null;
                    setEmpresaEdit(edit => edit ? { ...edit, logotipo: file } : edit);
                  }}
                />
              </label>
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