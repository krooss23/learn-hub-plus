import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";

const NewUser = () => (
  <MainLayout>
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: `url("/images/fondo1.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col pt-4 pl-4">
        <Link
          to="/usuarios"
          className="flex items-center text-base text-black bg-white/70 rounded-lg px-4 py-2 shadow hover:bg-white/90 transition-colors"
          style={{
            textDecoration: "none",
            fontWeight: 500,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            width: "fit-content",
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a listado de Usuarios
        </Link>
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
