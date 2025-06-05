import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.rol; // <-- usa 'rol' en vez de 'role'

  return (
    <MainLayout>
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "profesor" && <TeacherDashboard />}
      {/* Agrega aquí el dashboard de estudiante si lo tienes */}
    </MainLayout>
  );
};

export default Dashboard;
