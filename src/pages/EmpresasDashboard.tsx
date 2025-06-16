import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EmpresasDashboard() {
  const { empresaId } = useParams();
  const [empresa, setEmpresa] = useState<{ nombre: string; logoUrl?: string } | null>(null);

  useEffect(() => {
    // Reemplaza la URL por la de tu API real
    fetch(`http://localhost:5214/api/empresas/${empresaId}`)
      .then(res => res.json())
      .then(data => setEmpresa(data))
      .catch(() => setEmpresa(null));
  }, [empresaId]);

  if (!empresa) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-gray-500">Cargando datos de la empresa...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
      {empresa.logoUrl && (
        <img
          src={empresa.logoUrl}
          alt="Logotipo de la empresa"
          className="w-28 h-28 object-contain mb-4 rounded-xl shadow"
        />
      )}
      <h1 className="text-3xl font-bold mb-2 text-primary">{empresa.nombre}</h1>
      <p className="text-lg text-gray-700 mb-6">Bienvenido al dashboard de la empresa</p>
      {/* Aquí puedes agregar más widgets, estadísticas, accesos rápidos, etc. */}
    </div>
  );
}