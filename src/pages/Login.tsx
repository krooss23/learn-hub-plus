import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5214/api/upload/portada/seleccionada")
      .then((res) => res.json())
      .then((data) => {
        if (data.url) setBgUrl(data.url);
      });
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={
        bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Simple header */}
      <header className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Aorus INC
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Al iniciar sesión, aceptas nuestros{" "}
              <a href="#" className="text-primary hover:underline">
                Términos de Servicio
              </a>{" "}
              y{" "}
              <a href="#" className="text-primary hover:underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Aorus INC. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
