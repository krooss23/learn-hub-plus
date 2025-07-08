import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Shield, Bell, User, Image as ImageIcon, Palette, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Cambia aquí el nombre real de tu plataforma
const initialGeneral = {
  nombrePlataforma: "Aurum INC",
  institucion: "Instituto Tecnológico",
  descripcion: "Plataforma de aprendizaje en línea diseñada para ofrecer la mejor experiencia educativa.",
  zonaHoraria: "America/Mexico_City",
  idioma: "Español",
};

const ConfiguracionSistema = () => {
  const [tab, setTab] = useState("general");
  const [general, setGeneral] = useState(initialGeneral);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneral({ ...general, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar la configuración
    alert("Configuración guardada");
  };

  // Estado para logotipo (copiado/adaptado de EmpresasList)
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [systemImages, setSystemImages] = useState<string[]>([]);
  const [selectedSystemImage, setSelectedSystemImage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Funciones para logotipo (copiado/adaptado de EmpresasList)
  const openLogoModal = async () => {
    setShowLogoModal(true);
    // Obtiene las imágenes reales de la API .NET
    const res = await fetch("http://localhost:5214/api/upload/portada");
    const images = await res.json();
    setSystemImages(images);
  };

  // SUBIR imagen de portada
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setSelectedSystemImage(null);

      // Subir la imagen al backend
      const formData = new FormData();
      formData.append("file", file);
      await fetch("http://localhost:5214/api/upload/portada", {
        method: "POST",
        body: formData,
      });

      // Refrescar la lista de imágenes
      const res = await fetch("http://localhost:5214/api/upload/portada");
      const images = await res.json();
      setSystemImages(images);

      // Mostrar la vista previa localmente
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSelectedLogo = async () => {
    if (selectedSystemImage) {
      setLogoPreview(selectedSystemImage);
      setLogoFile(null);
      // Guarda la URL seleccionada en el backend
      await fetch("http://localhost:5214/api/upload/portada/seleccionada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: selectedSystemImage }),
      });
    }
    setShowLogoModal(false);
  };

  // BORRAR imagen de portada
  const handleDeleteSystemImage = async () => {
    if (!selectedSystemImage) return;
    await fetch("http://localhost:5214/api/upload/portada", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: selectedSystemImage }),
    });
    // Refrescar la lista de imágenes
    const res = await fetch("http://localhost:5214/api/upload/portada");
    const images = await res.json();
    setSystemImages(images);
    setSelectedSystemImage(null);
    setLogoPreview(null);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600 bg-blue-100 rounded p-1" />
          <h1 className="text-3xl font-bold">Configuración del LMS</h1>
        </div>
        <p className="text-gray-500 mb-6">
          Gestiona la configuración general de tu plataforma de aprendizaje
        </p>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "general"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("general")}
            >
              <BookOpen className="w-5 h-5" /> General
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "imagenes"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("imagenes")}
            >
              <ImageIcon className="w-5 h-5" /> Imágenes
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "usuarios"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("usuarios")}
            >
              <User className="w-5 h-5" /> Usuarios
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "notificaciones"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("notificaciones")}
            >
              <Bell className="w-5 h-5" /> Notificaciones
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "apariencia"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("apariencia")}
            >
              <Palette className="w-5 h-5" /> Apariencia
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center gap-2 justify-center font-medium transition ${
                tab === "seguridad"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTab("seguridad")}
            >
              <Shield className="w-5 h-5" /> Seguridad
            </button>
          </div>
        </div>
        {/* Contenido de cada tab */}
        {tab === "general" && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Información General</h2>
                <p className="text-gray-500 text-sm">
                  Configura la información básica de tu plataforma LMS
                </p>
              </div>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Nombre de la Plataforma</label>
                  <input
                    type="text"
                    name="nombrePlataforma"
                    value={general.nombrePlataforma}
                    onChange={handleGeneralChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Institución</label>
                  <input
                    type="text"
                    name="institucion"
                    value={general.institucion}
                    onChange={handleGeneralChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={general.descripcion}
                  onChange={handleGeneralChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Zona Horaria</label>
                  <input
                    type="text"
                    name="zonaHoraria"
                    value={general.zonaHoraria}
                    onChange={handleGeneralChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Idioma Principal</label>
                  <input
                    type="text"
                    name="idioma"
                    value={general.idioma}
                    onChange={handleGeneralChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ...otros inputs... */}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleGuardar}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Puedes agregar el contenido de las otras tabs aquí */}
        {tab === "imagenes" && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Imágenes de Login</h2>
                <p className="text-gray-500 text-sm">
                  Sube, edita o elimina imágenes que se mostrarán en la pantalla de login.
                </p>
              </div>
            </div>
            {/* Apartado de gestión de imágenes de login */}
            <div>
              <label className="block font-medium mb-1">Imágenes</label>
              <Button
                type="button"
                variant="outline"
                onClick={openLogoModal}
              >
                Seleccionar o subir imagen
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              {/* Vista previa de la imagen seleccionada */}
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Vista previa imagen login"
                  className="w-24 h-24 object-contain mt-2"
                />
              ) : null}
            </div>
          </div>
        )}
        {/* ...otras tabs como usuarios, notificaciones, apariencia, seguridad... */}
      </div>
      {/* Modal para selección de logotipo */}
      {showLogoModal && (
        <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecciona o sube una imagen</DialogTitle>
              <DialogDescription>
                Puedes elegir una imagen existente o subir una nueva desde tu computadora.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {systemImages.map(url => (
                  <img
                    key={url}
                    src={url}
                    alt="Logotipo del sistema"
                    className={`w-24 h-24 object-cover rounded cursor-pointer border ${selectedSystemImage === url ? "border-primary" : "border-gray-200"}`}
                    onClick={() => {
                      setSelectedSystemImage(url);
                      setLogoPreview(url);
                      setLogoFile(null);
                    }}
                  />
                ))}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                disabled={!selectedSystemImage}
                onClick={handleDeleteSystemImage}
              >
                Borrar imagen
              </Button>
              <Button
                onClick={handleUseSelectedLogo}
                disabled={!selectedSystemImage && !logoFile}
              >
                Usar logotipo seleccionado
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default ConfiguracionSistema;