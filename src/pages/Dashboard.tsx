import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.rol;

  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5214/api/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, []);

  return (
    <MainLayout>
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "profesor" && <TeacherDashboard />}
      
    </MainLayout>
  );
};

export default Dashboard;
