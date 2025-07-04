import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmpresaNavbar from "@/components/layout/EmpresaNavbar";

// Puedes mapear categorías aquí si tus recursos no traen la propiedad
const CATEGORIAS = [
  {
    key: "catalogo",
    nombre: "Catálogos de Productos",
    icono: "📘",
    color: "bg-blue-100 text-blue-600",
    descripcion: "Información detallada de vehículos y modelos disponibles.",
  },
  {
    key: "manual",
    nombre: "Manuales de Usuario",
    icono: "📗",
    color: "bg-green-100 text-green-600",
    descripcion: "Guías completas para el uso y mantenimiento de los vehículos.",
  },
  {
    key: "servicio",
    nombre: "Guías de Servicio Técnico",
    icono: "🛠️",
    color: "bg-yellow-100 text-yellow-600",
    descripcion: "Documentación técnica para reparaciones y mantenimiento especializado.",
  },
  {
    key: "marketing",
    nombre: "Material de Marketing y Ventas",
    icono: "📑",
    color: "bg-purple-100 text-purple-600",
    descripcion: "Folleto, presentaciones y recursos para el equipo de ventas.",
  },
];

function getCategoria(recurso: any) {
  // Si no tienes la propiedad, puedes mapear por nombre o tipo aquí
  if (recurso.categoria) return recurso.categoria;
  if (recurso.nombre?.toLowerCase().includes("manual")) return "manual";
  if (recurso.nombre?.toLowerCase().includes("servicio")) return "servicio";
  if (recurso.nombre?.toLowerCase().includes("marketing") || recurso.nombre?.toLowerCase().includes("presentación")) return "marketing";
  return "catalogo";
}

function getIconoTipo(tipo: string) {
  switch (tipo) {
    case "pdf":
      return <span className="text-red-500">📄</span>;
    case "excel":
      return <span className="text-green-600">📊</span>;
    case "docx":
      return <span className="text-blue-600">📄</span>;
    case "pptx":
      return <span className="text-orange-500">📑</span>;
    default:
      return <span className="text-gray-500">📁</span>;
  }
}

function getFileSize(size: number) {
  if (!size) return null;
  if (size > 1024 * 1024)
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  return (size / 1024).toFixed(1) + " KB";
}

export default function EmpresaRecursos() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<any>(null);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5214/api/empresas/${id}`)
      .then(res => res.json())
      .then(setEmpresa);

    fetch(`http://localhost:5214/api/empresas/${id}/recursos`)
      .then(res => res.json())
      .then(setRecursos);
  }, [id]);

  const recursosFiltrados = recursos
    .filter(r => r.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .map(r => ({ ...r, categoria: getCategoria(r) }));

  return (
    <>
      {empresa && (
        <EmpresaNavbar nombre={empresa.nombre} logotipoUrl={empresa.logotipoUrl} />
      )}
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Encabezado principal */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Recursos Organizados</h1>
          <p className="text-gray-600 mb-4">
            Encuentra documentación, manuales, catálogos y herramientas para ventas, servicio técnico, postventa, financiamiento y atención al cliente de vehículos.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Actualizado diariamente</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Acceso 24/7</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Múltiples formatos</span>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar recurso..."
            className="border rounded-md px-4 py-2 w-full md:w-1/3"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {/* Secciones por categoría */}
        {CATEGORIAS.map(cat => {
          const recursosCat = recursosFiltrados.filter(r => r.categoria === cat.key);
          return (
            <div key={cat.key} className="bg-white rounded-2xl shadow p-8 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${cat.color} rounded-full w-10 h-10 flex items-center justify-center text-2xl`}>
                  {cat.icono}
                </div>
                <h2 className="text-xl font-bold">{cat.nombre}</h2>
              </div>
              <p className="text-gray-600 mb-6">{cat.descripcion}</p>
              {recursosCat.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-center py-8 mb-2">
                  No hay recursos disponibles.
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {recursosCat.map(recurso => (
                    <a
                      key={recurso.id}
                      href={recurso.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-start bg-white border border-gray-200 rounded-xl px-5 py-4 min-w-[220px] max-w-xs shadow-sm hover:shadow-md transition group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getIconoTipo(recurso.tipo)}</span>
                        <span className="font-semibold text-sm text-gray-800 group-hover:underline">{recurso.nombre}</span>
                      </div>
                      {recurso.tamano && (
                        <span className="text-xs text-gray-500">{getFileSize(recurso.tamano)}</span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}