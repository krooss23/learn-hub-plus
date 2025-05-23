import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";

const NewUser = () => (
  <MainLayout>
    <div className="w-full">
      <div className="flex flex-col pt-4 pl-4">
        <Link to="/usuarios" className="flex items-center text-sm text-black hover:underline mb-1">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a listado de Usuarios
        </Link>
        <h1 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  </MainLayout>
);

export default NewUser;
