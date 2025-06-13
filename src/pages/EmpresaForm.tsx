import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const campos = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "textoBienvenida", label: "Texto de bienvenida", type: "textarea" },
  // El campo logotipo se maneja con modal, no aquí
  { name: "imagenFondoLogin", label: "Imagen de fondo de login", type: "file" },
  { name: "imagenHeader", label: "Imagen para header", type: "file" }
];

export default function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: "",
    pais: "",
    zona: "",
    region: "",
    textoBienvenida: "",
    logotipo: null as File | null,
    logotipoUrl: "",
    imagenFondoLogin: null as File | null,
    imagenHeader: null as File | null,
    activo: true,
  });
  const [paises, setPaises] = useState<string[]>([]);
  const [regiones, setRegiones] = useState<string[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [zonasData, setZonasData] = useState<Record<string, string[]>>({});
  const [zonaEditable, setZonaEditable] = useState(false);
  const navigate = useNavigate();

  // Estados para el modal de logotipo
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [systemImages, setSystemImages] = useState<string[]>([]);
  const [selectedSystemImage, setSelectedSystemImage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cargar países al montar
  useEffect(() => {
    fetch("http://localhost:5214/api/regiones")
      .then(res => res.json())
      .then(setPaises);
  }, []);

  // Cargar regiones y zonas al cambiar país
  useEffect(() => {
    if (form.pais) {
      fetch(`http://localhost:5214/api/regiones/${encodeURIComponent(form.pais)}`)
        .then(res => res.ok ? res.json() : [])
        .then(setRegiones);

      fetch(`http://localhost:5214/api/regiones/${encodeURIComponent(form.pais)}/zonas`)
        .then(res => res.ok ? res.json() : {})
        .then(data => {
          setZonas(Object.keys(data));
          setZonasData(data);
          setForm(f => ({ ...f, zona: "", region: "" }));
        });
    } else {
      setRegiones([]);
      setZonas([]);
      setZonasData({});
      setForm(f => ({ ...f, zona: "", region: "" }));
    }
  }, [form.pais]);

  // Al seleccionar región, buscar y setear la zona automáticamente
  useEffect(() => {
    if (form.region && zonasData) {
      let foundZona = "";
      for (const [zona, regionesZona] of Object.entries(zonasData)) {
        if (regionesZona.includes(form.region)) {
          foundZona = zona;
          break;
        }
      }
      if (foundZona && foundZona !== form.zona) {
        setForm(f => ({ ...f, zona: foundZona }));
      }
    }
  }, [form.region, zonasData]);

  // Modal logotipo: abrir y cargar imágenes del sistema
  const openLogoModal = async () => {
    setShowLogoModal(true);
    const res = await fetch("http://localhost:5214/api/upload");
    const images = await res.json();
    setSystemImages(images);
  };

  // Modal logotipo: manejar archivo nuevo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setSelectedSystemImage(null);
      setForm(f => ({ ...f, logotipo: file, logotipoUrl: "" }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal logotipo: usar imagen seleccionada del sistema
  const handleUseSelectedLogo = () => {
    if (selectedSystemImage) {
      setLogoPreview(selectedSystemImage);
      setLogoFile(null);
      setForm(f => ({ ...f, logotipo: null, logotipoUrl: selectedSystemImage }));
    }
    setShowLogoModal(false);
  };

  // Modal logotipo: borrar imagen del sistema
  const handleDeleteSystemImage = async () => {
    if (!selectedSystemImage) return;
    await fetch("http://localhost:5214/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: selectedSystemImage }),
    });
    // Actualiza la lista de imágenes
    const res = await fetch("http://localhost:5214/api/upload");
    const images = await res.json();
    setSystemImages(images);
    setSelectedSystemImage(null);
    setLogoPreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Nombre", form.nombre);
    formData.append("Pais", form.pais);
    formData.append("Region", form.region);
    formData.append("Zona", form.zona);
    formData.append("TextoBienvenida", form.textoBienvenida);
    formData.append("Activo", form.activo ? "true" : "false");

    // Logotipo: si hay archivo, súbelo primero y usa la URL devuelta
    let logotipoUrl = form.logotipoUrl || "";
    if (logoFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", logoFile);
      const res = await fetch("http://localhost:5214/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      if (res.ok) {
        const data = await res.json();
        logotipoUrl = data.url;
      }
    }
    if (logotipoUrl) {
      formData.append("LogotipoUrl", logotipoUrl);
    }

    if (form.imagenFondoLogin) formData.append("ImagenFondoLogin", form.imagenFondoLogin);
    if (form.imagenHeader) formData.append("ImagenHeader", form.imagenHeader);

    const res = await fetch("http://localhost:5214/api/empresas", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      navigate("/empresas");
    } else {
      const error = await res.text();
      alert("Error al crear empresa: " + error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg space-y-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Empresa</h2>
        <div>
          <label className="block text-gray-700 mb-1">País</label>
          <select
            name="pais"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            value={form.pais}
            onChange={handleChange}
            disabled={zonaEditable}
          >
            <option value="">Selecciona un país</option>
            {paises.map(pais => (
              <option key={pais} value={pais}>{pais}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Región</label>
          <select
            name="region"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.region}
            onChange={handleChange}
            disabled={!regiones.length || zonaEditable}
            required
          >
            <option value="">Selecciona una región</option>
            {regiones.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Zona</label>
          {zonaEditable ? (
            <select
              name="zona"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={form.zona}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una zona</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>{zona}</option>
              ))}
            </select>
          ) : (
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              value={form.zona}
              name="zona"
              readOnly
              tabIndex={-1}
            />
          )}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            id="zonaEditable"
            checked={zonaEditable}
            onChange={e => setZonaEditable(e.target.checked)}
          />
          <label htmlFor="zonaEditable" className="text-gray-700 select-none cursor-pointer">
            Editar zona 
          </label>
        </div>
        {/* Nombre */}
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            name="nombre"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        {/* Texto de bienvenida */}
        <div>
          <label className="block text-gray-700 mb-1">Texto de bienvenida</label>
          <textarea
            name="textoBienvenida"
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            value={form.textoBienvenida}
            onChange={handleChange}
          />
        </div>
        {/* Logotipo con modal */}
        <div>
          <label className="block text-gray-700 mb-1">Logotipo</label>
          <Button
            type="button"
            variant="outline"
            onClick={openLogoModal}
          >
            Seleccionar o subir logotipo
          </Button>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Vista previa logotipo"
              className="w-24 h-24 object-contain mt-2"
            />
          )}
        </div>
        {/* Imagen de fondo de login con mismo estilo */}
        <div>
          <label className="block text-gray-700 mb-1">Imagen de fondo de login</label>
          <label>
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <span>Seleccionar imagen de fondo</span>
            </Button>
            <Input
              type="file"
              name="imagenFondoLogin"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          {form.imagenFondoLogin && (
            <span className="block mt-2 text-sm text-gray-600">
              {typeof form.imagenFondoLogin === "string"
                ? form.imagenFondoLogin
                : (form.imagenFondoLogin as File).name}
            </span>
          )}
        </div>
        {/* Imagen para header con mismo estilo */}
        <div>
          <label className="block text-gray-700 mb-1">Imagen para header</label>
          <label>
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <span>Seleccionar imagen para header</span>
            </Button>
            <Input
              type="file"
              name="imagenHeader"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          {form.imagenHeader && (
            <span className="block mt-2 text-sm text-gray-600">
              {typeof form.imagenHeader === "string"
                ? form.imagenHeader
                : (form.imagenHeader as File).name}
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded shadow transition hover:scale-105 hover:bg-primary/90"
          >
            Guardar
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded shadow transition hover:scale-105"
            onClick={() => navigate("/empresas")}
          >
            Volver al listado
          </button>
        </div>
      </form>
      {/* Modal para seleccionar o subir logotipo */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona o sube un logotipo</DialogTitle>
            <DialogDescription>
              Puedes elegir un logotipo existente o subir uno nuevo desde tu computadora.
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
                  onClick={() => setSelectedSystemImage(url)}
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
            >
              Usar logotipo seleccionado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}