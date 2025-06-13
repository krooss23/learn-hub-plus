import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CreateCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [professor, setProfessor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [companies, setCompanies] = useState<{ id: string, nombre: string }[]>([]);
  const [company, setCompany] = useState(""); // Aquí guardarás el id
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [systemImages, setSystemImages] = useState<string[]>([]);
  const [selectedSystemImage, setSelectedSystemImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5214/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch("http://localhost:5214/api/empresas")
      .then(res => res.json())
      .then(data => setCompanies(
        data.map((c: any) => ({
          id: String(c.id),
          nombre: c.nombre
        }))
      ));
    // Cambia aquí el endpoint para imágenes del sistema
    fetch("http://localhost:5214/api/upload")
      .then(res => res.json())
      .then(data => setSystemImages(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5214/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !company) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    let imagenUrl = "";
    if (imageFile) {
      imagenUrl = await uploadImage(imageFile) || "";
      if (!imagenUrl) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No se pudo subir la imagen",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedSystemImage) {
      imagenUrl = selectedSystemImage;
    }

    fetch("http://localhost:5214/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: title,
        descripcion: description,
        categoria: category,
        empresaId: company,
        fechaInicio: startDate,
        fechaTermino: endDate,
        horario: schedule,
        profesor: professor,
        imagenUrl,
      }),
    })
      .then(res => {
        setIsLoading(false);
        if (!res.ok) throw new Error("Error al crear el curso");
        toast({
          title: "Curso creado",
          description: "El curso ha sido creado exitosamente",
        });
        navigate("/manage-courses");
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No se pudo crear el curso",
          variant: "destructive",
        });
      });
  };

  const openImageModal = async () => {
    setShowImageModal(true);
    // Llama a tu API para obtener imágenes guardadas
    const res = await fetch("http://localhost:5214/api/upload");
    const images = await res.json();
    setSystemImages(images); // images debe ser un array de URLs
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Nuevo Curso</CardTitle>
        <CardDescription>
          Completa el formulario para crear un nuevo curso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Curso *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ej: Mecanica avanzada"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe el contenido y objetivos del curso"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={category}
              onValueChange={(val) => {
                if (val === "__add__") {
                  setShowNewCategory(true);
                  setCategory("");
                } else {
                  setCategory(val);
                  setShowNewCategory(false);
                }
              }}
              required
              disabled={categories.length === 0 && !showNewCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
                <SelectItem value="__add__" className="text-primary font-semibold">
                  + Agregar nueva categoría
                </SelectItem>
              </SelectContent>
            </Select>
            {(showNewCategory || categories.length === 0) && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Nueva categoría"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={async () => {
                    const trimmed = newCategory.trim();
                    if (!trimmed) {
                      toast({
                        title: "Error",
                        description: "El nombre de la categoría es obligatorio",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (categories.includes(trimmed)) {
                      toast({
                        title: "Error",
                        description: "La categoría ya existe",
                        variant: "destructive",
                      });
                      return;
                    }
                    try {
                      // Log para depuración
                      console.log("Enviando categoría:", { nombre: trimmed });
                      const res = await fetch("http://localhost:5214/api/categories", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(trimmed), // Solo el string, no un objeto
                      });
                      if (!res.ok) {
                        const msg = await res.text();
                        throw new Error(msg);
                      }
                      // Recarga categorías desde el backend
                      const catsRes = await fetch("http://localhost:5214/api/categories");
                      const cats = await catsRes.json();
                      setCategories(cats);
                      setCategory(trimmed);
                      setNewCategory("");
                      setShowNewCategory(false);
                      toast({ title: "Categoría agregada" });
                    } catch (err: any) {
                      toast({
                        title: "Error",
                        description: err.message || "No se pudo agregar la categoría",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Agregar
                </Button>
                {categories.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            )}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">No hay categorías registradas</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Empresa *</Label>
            <Select
              value={company}
              onValueChange={setCompany}
              required
              disabled={companies.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {companies.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">No hay empresas registradas</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Término</Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">Horario</Label>
            <Input
              id="schedule"
              type="text"
              placeholder="Ej: Lunes y Miércoles, 15:00-17:00"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Nombre de Profesor</Label>
            <Input
              id="professor"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Imagen de Portada</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openImageModal}
                  className="cursor-pointer"
                >
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Subir Imagen
                </Button>
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : "Ningún archivo seleccionado"}
                </span>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              {imagePreview && (
                <div className="relative h-40 w-full max-w-md border rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creando curso..." : "Crear Curso"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          * Campos obligatorios
        </p>
      </CardFooter>

      {/* Modal para seleccionar o subir imagen */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona o sube una imagen</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Imágenes del sistema */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {systemImages.map(url => (
                <img
                  key={url}
                  src={url}
                  alt="Imagen del sistema"
                  className={`w-24 h-24 object-cover rounded cursor-pointer border ${selectedSystemImage === url ? "border-primary" : "border-gray-200"}`}
                  onClick={() => setSelectedSystemImage(url)}
                />
              ))}
            </div>
            {/* Opción para cargar nueva imagen */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedSystemImage) {
                  setImagePreview(selectedSystemImage);
                  setImageFile(null); // Si seleccionas del sistema, no subes nuevo archivo
                }
                setShowImageModal(false);
              }}
            >
              Usar imagen seleccionada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreateCourseForm;
