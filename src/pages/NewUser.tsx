import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";

const NewUser = () => (
  <MainLayout>
    <div className="w-full">
      <div className="flex flex-col pt-8 pl-8">
        <Link to="/usuarios" className="flex items-center text-base text-black hover:underline mb-1">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Usuarios
        </Link>
        <h1 className="text-2xl font-bold mb-8">Crear Nuevo Usuario</h1>
      </div>
      <div className="flex justify-center items-center">
        <RegisterForm />
      </div>
    </div>
  </MainLayout>
);

export default NewUser;
