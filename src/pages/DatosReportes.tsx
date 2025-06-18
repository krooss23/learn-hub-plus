import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [usuarios, setUsuarios] = useState<number>(0);
  const [cursos, setCursos] = useState<number>(0);
  const [profesores, setProfesores] = useState<number>(0);
  const [cursosRaw, setCursosRaw] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<{ nombre: string; logotipoUrl?: string } | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

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

  // Agrupar cursos por mes y año seleccionado
  const dataPorMes: any[] = MESES.map((mes, idx) => {
    const obj: any = { mes };
    years.forEach((year: number) => {
      obj[year] = cursosRaw.filter((curso: any) => {
        const fecha = new Date(curso.fechaInicio);
        return (
          !isNaN(fecha.getTime()) &&
          fecha.getFullYear() === year &&
          fecha.getMonth() === idx
        );
      }).length;
    });
    return obj;
  });

  // Manejar selección de años
  const handleYearChange = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Colores para las barras
  const barColors = ["#2563eb", "#60a5fa", "#818cf8", "#f59e42", "#e11d48", "#10b981", "#fbbf24"];

  return (
    <>
      {empresa && (
        <EmpresaNavbar nombre={empresa.nombre} logotipoUrl={empresa.logotipoUrl} />
      )}
      <div className="p-8">
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedYears.map((year, idx) => (
                <Bar
                  key={year}
                  dataKey={year.toString()}
                  fill={barColors[idx % barColors.length]}
                  name={year.toString()}
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