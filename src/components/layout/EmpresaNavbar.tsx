import React from "react";

interface EmpresaNavbarProps {
  nombre: string;
  logotipoUrl?: string;
}

const EmpresaNavbar: React.FC<EmpresaNavbarProps> = ({ nombre, logotipoUrl }) => (
  <nav className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
    <div className="flex items-center gap-3">
      {logotipoUrl && (
        <img
          src={logotipoUrl.startsWith("http") ? logotipoUrl : `http://localhost:5214${logotipoUrl}`}
          alt="Logo"
          className="h-10 w-10 rounded-full object-contain border"
        />
      )}
      <span className="text-xl font-bold text-teal-700">{nombre}</span>
    </div>
    {/* Puedes agregar aquí botones, usuario, etc */}
  </nav>
);

export default EmpresaNavbar;