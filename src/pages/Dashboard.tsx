import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.rol;
  const empresaId = user?.empresaId;

  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5214/api/empresas")
      .then((res) => res.json())
      .then((data) => {
        if (userRole === "admin") {
          setEmpresas(data);
        } else {
          setEmpresas(data.filter((e) => e.id === empresaId));
        }
      });
  }, [userRole, empresaId]);

  return (
    <MainLayout>
      {userRole === "admin" && <AdminDashboard empresas={empresas} />}
      {userRole === "profesor" && <TeacherDashboard empresaId={empresaId} />}
      {userRole === "estudiante" && <StudentDashboard empresaId={empresaId} />}
    </MainLayout>
  );
};

export default Dashboard;
