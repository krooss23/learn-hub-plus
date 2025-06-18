import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import EmpresaNavbar from "@/components/layout/EmpresaNavbar";

type Agrupacion = "dia" | "mes" | "año";

export default function DatosReportes() {
  const { empresaId } = useParams();
  const [usuarios, setUsuarios] = useState<number>(0);
  const [cursos, setCursos] = useState<number>(0);
  const [profesores, setProfesores] = useState<number>(0);
  const [cursosRaw, setCursosRaw] = useState<any[]>([]);
  const [cursosAgrupados, setCursosAgrupados] = useState<{ label: string; cursos: number }[]>([]);
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("mes");
  const [empresa, setEmpresa] = useState<{ nombre: string; logotipoUrl?: string } | null>(null);

  useEffect(() => {
    if (!empresaId) return;

    fetch(`http://localhost:5214/api/empresas/${empresaId}`)
      .then(res => res.json())
      .then(data => setEmpresa(data));

    fetch(`http://localhost:5214/api/empresas/${empresaId}/usuarios`)
      .then(res => res.json())
      .then(data => setUsuarios(data.length));

    fetch(`http://localhost:5214/api/empresas/${empresaId}/cursos`)
      .then(res => res.json())
      .then(data => {
        setCursos(data.length);
        setCursosRaw(data);
      });

    fetch(`http://localhost:5214/api/empresas/${empresaId}/profesores`)
      .then(res => res.json())
      .then(data => setProfesores(data.length));
  }, [empresaId]);

  useEffect(() => {
    // Agrupa los cursos según la selección
    if (!cursosRaw.length) return;

    const agrupados: { [key: string]: number } = {};
    cursosRaw.forEach((curso: any) => {
      const fecha = new Date(curso.fechaInicio);
      let label = "";
      if (agrupacion === "dia") {
        label = fecha.toLocaleDateString();
      } else if (agrupacion === "mes") {
        label = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      } else if (agrupacion === "año") {
        label = `${fecha.getFullYear()}`;
      }
      agrupados[label] = (agrupados[label] || 0) + 1;
    });

    // Ordena las etiquetas por fecha
    const sorted = Object.entries(agrupados)
      .map(([label, cursos]) => ({ label, cursos }))
      .sort((a, b) => {
        if (agrupacion === "año") return Number(a.label) - Number(b.label);
        if (agrupacion === "mes") {
          const [ma, ya] = a.label.split("/").map(Number);
          const [mb, yb] = b.label.split("/").map(Number);
          return ya !== yb ? ya - yb : ma - mb;
        }
        // Para día
        return new Date(a.label).getTime() - new Date(b.label).getTime();
      });

    setCursosAgrupados(sorted);
  }, [cursosRaw, agrupacion]);

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
            <h2 className="text-xl font-semibold">Cursos creados por {agrupacion}</h2>
            <select
              className="border rounded px-2 py-1"
              value={agrupacion}
              onChange={e => setAgrupacion(e.target.value as Agrupacion)}
            >
              <option value="dia">Día</option>
              <option value="mes">Mes</option>
              <option value="año">Año</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cursosAgrupados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cursos" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}