import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from "recharts";
import EmpresaNavbar from "@/components/layout/EmpresaNavbar";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function getYearsFromCursos(cursosRaw: any[]) {
  return Array.from(
    new Set(
      cursosRaw
        .map((curso: any) => {
          const fecha = new Date(curso.fechaInicio);
          return !isNaN(fecha.getTime()) ? fecha.getFullYear() : null;
        })
        .filter(Boolean)
    )
  ).sort((a, b) => a - b) as number[];
}

export default function DatosReportes() {
  const { empresaId } = useParams();
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState<number>(0);
  const [cursos, setCursos] = useState<number>(0);
  const [profesores, setProfesores] = useState<number>(0);
  const [cursosRaw, setCursosRaw] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<{ nombre: string; logotipoUrl?: string } | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const METRICAS = [
    { key: "cursos", label: "Cursos" },
    { key: "usuarios", label: "Alumnos" },
    { key: "profesores", label: "Profesores" },
  ];

  const [selectedMetricas, setSelectedMetricas] = useState<string[]>(["cursos"]);

  useEffect(() => {
    if (!empresaId) return;

    fetch(`http://localhost:5214/api/empresas/${empresaId}`)
      .then(res => res.json())
      .then(data => setEmpresa(data));

    fetch(`http://localhost:5214/api/empresas/${empresaId}/usuarios`)
      .then(res => res.json())
      .then((data: any[]) => setUsuarios(data.length));

    fetch(`http://localhost:5214/api/empresas/${empresaId}/cursos`)
      .then(res => res.json())
      .then((data: any[]) => {
        setCursos(data.length);
        setCursosRaw(data);

        const yearsInData = getYearsFromCursos(data);
        setYears(yearsInData);
        setSelectedYears(yearsInData.length ? [yearsInData[yearsInData.length - 1]] : []);
      });

    fetch(`http://localhost:5214/api/empresas/${empresaId}/profesores`)
      .then(res => res.json())
      .then((data: any[]) => setProfesores(data.length));
  }, [empresaId]);

  const handleYearChange = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleMetricChange = (metrica: string) => {
    setSelectedMetricas(prev => {
      if (prev.includes(metrica)) {
        return prev.filter(m => m !== metrica);
      }
      if (prev.length < 2) {
        return [...prev, metrica];
      }
      return [prev[1], metrica];
    });
  };

  // Agrupar datos por mes y métrica
  const dataPorMes: any[] = MESES.map((mes, idx) => {
    const obj: any = { mes };
    if (selectedMetricas.includes("cursos")) {
      obj["Cursos"] = cursosRaw.filter((curso: any) => {
        const fecha = new Date(curso.fechaInicio);
        return !isNaN(fecha.getTime()) && fecha.getMonth() === idx;
      }).length;
    }
    if (selectedMetricas.includes("usuarios")) {
      obj["Alumnos"] = usuarios; // Puedes mejorar esto si tienes fechas de registro
    }
    if (selectedMetricas.includes("profesores")) {
      obj["Profesores"] = profesores; // Igual, si tienes fechas de alta
    }
    return obj;
  });

  // Colores para las barras
  const barColors = ["#2563eb", "#60a5fa", "#818cf8", "#f59e42", "#e11d48", "#10b981", "#fbbf24"];

  return (
    <>
      {empresa && (
        <EmpresaNavbar nombre={empresa.nombre} logotipoUrl={empresa.logotipoUrl} />
      )}
      <div className="p-8">
        {/* Botón de volver */}
        <button
          onClick={() => navigate(`/empresas/${empresaId}/public`)}
          className="mb-6 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition flex items-center gap-2 shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al panel principal
        </button>
        <h1 className="text-2xl font-bold mb-6">Datos & Reportes de la Empresa</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Usuarios</div>
            <div className="text-3xl font-bold">{usuarios}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Cursos</div>
            <div className="text-3xl font-bold">{cursos}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Profesores</div>
            <div className="text-3xl font-bold">{profesores}</div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Comparar cursos por año</h2>
              <span className="ml-4 text-gray-400 font-medium">|</span>
              <div className="flex gap-2 ml-2">
                {years.map((year, idx) => (
                  <label key={year} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(year)}
                      onChange={() => handleYearChange(year)}
                    />
                    <span style={{ color: barColors[idx % barColors.length], fontWeight: 600 }}>{year}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold">Métrica:</span>
            {METRICAS.map(m => (
              <label key={m.key} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={selectedMetricas.includes(m.key)}
                  onChange={() => handleMetricChange(m.key)}
                  disabled={
                    !selectedMetricas.includes(m.key) && selectedMetricas.length >= 2
                  }
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetricas.map((metrica, idx) => (
                <Bar
                  key={metrica}
                  dataKey={
                    METRICAS.find(m => m.key === metrica)?.label || metrica
                  }
                  fill={barColors[idx % barColors.length]}
                  name={METRICAS.find(m => m.key === metrica)?.label || metrica}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}