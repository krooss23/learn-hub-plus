import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function DatosReportes() {
  const { empresaId } = useParams();
  const [usuarios, setUsuarios] = useState<number>(0);
  const [cursos, setCursos] = useState<number>(0);
  const [profesores, setProfesores] = useState<number>(0);

  // Simulación de datos de cursos por mes
  const cursosPorMes = [
    { mes: "Ene", cursos: 2 },
    { mes: "Feb", cursos: 3 },
    { mes: "Mar", cursos: 5 },
    { mes: "Abr", cursos: 4 },
    { mes: "May", cursos: 6 },
    { mes: "Jun", cursos: 3 },
  ];

  useEffect(() => {
    // Aquí deberías hacer fetch a tu backend para obtener los datos reales
    // Ejemplo:
    // fetch(`http://localhost:5214/api/empresas/${empresaId}/usuarios`)
    //   .then(res => res.json())
    //   .then(data => setUsuarios(data.length));
    // fetch(`http://localhost:5214/api/empresas/${empresaId}/cursos`)
    //   .then(res => res.json())
    //   .then(data => setCursos(data.length));
    // fetch(`http://localhost:5214/api/empresas/${empresaId}/profesores`)
    //   .then(res => res.json())
    //   .then(data => setProfesores(data.length));
  }, [empresaId]);

  return (
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
        <h2 className="text-xl font-semibold mb-4">Cursos creados por mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cursosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cursos" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}