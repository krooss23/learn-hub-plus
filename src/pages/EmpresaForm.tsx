import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const campos = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "textoBienvenida", label: "Texto de bienvenida", type: "textarea" },
  { name: "logotipo", label: "Logotipo", type: "file" },
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
    imagenFondoLogin: null as File | null,
    imagenHeader: null as File | null,
    activo: true, // <-- agrega esta línea
  });
  const [paises, setPaises] = useState<string[]>([]);
  const [regiones, setRegiones] = useState<string[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [zonasData, setZonasData] = useState<Record<string, string[]>>({});
  const [zonaEditable, setZonaEditable] = useState(false);
  const navigate = useNavigate();

  // Cargar países al montar
  useEffect(() => {
    fetch("http://localhost:5214/api/regiones")
      .then(res => res.json())
      .then(setPaises);
  }, []);

  // Cargar regiones y zonas al cambiar país
  useEffect(() => {
    if (form.pais) {
      // Cargar regiones
      fetch(`http://localhost:5214/api/regiones/${encodeURIComponent(form.pais)}`)
        .then(res => res.ok ? res.json() : [])
        .then(setRegiones);

      // Cargar zonas
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
    formData.append("nombre", form.nombre);
    formData.append("pais", form.pais);
    formData.append("region", form.region);
    formData.append("zona", form.zona);
    formData.append("TextoBienvenida", form.textoBienvenida);
    formData.append("activo", form.activo ? "true" : "false");
    if (form.logotipo) formData.append("logotipo", form.logotipo);
    if (form.imagenFondoLogin) formData.append("imagenFondoLogin", form.imagenFondoLogin);
    if (form.imagenHeader) formData.append("imagenHeader", form.imagenHeader);

    const res = await fetch("http://localhost:5214/api/empresas", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Empresa creada correctamente, navega al listado
      navigate("/empresas");
    } else {
      // Opcional: muestra el error
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
        {campos.map(campo =>
          campo.type === "textarea" ? (
            <div key={campo.name}>
              <label className="block text-gray-700 mb-1">{campo.label}</label>
              <textarea
                name={campo.name}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
                value={form[campo.name as keyof typeof form] as string}
                onChange={handleChange}
              />
            </div>
          ) : campo.type === "file" ? (
            <div key={campo.name}>
              <label className="block text-gray-700 mb-1">{campo.label}</label>
              <input
                type="file"
                name={campo.name}
                className="w-full"
                onChange={handleChange}
              />
            </div>
          ) : (
            <div key={campo.name}>
              <label className="block text-gray-700 mb-1">{campo.label}</label>
              <input
                name={campo.name}
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form[campo.name as keyof typeof form] as string}
                onChange={handleChange}
                placeholder={campo.label}
                required={campo.required}
              />
            </div>
          )
        )}
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
    </div>
  );
}