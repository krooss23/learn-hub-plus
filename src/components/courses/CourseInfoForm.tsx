import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Props {
  course: any;
  setCourse: (course: any) => void;
}

const CourseInfoForm = ({ course, setCourse }: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [systemImages, setSystemImages] = useState<string[]>([]);
  const [selectedSystemImage, setSelectedSystemImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(course.coverImage || null);

  useEffect(() => {
    fetch("http://localhost:5214/api/courses/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));

    fetch("http://localhost:5214/api/users/teachers")
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(() => setTeachers([]));
  }, []);

  // Cargar imágenes del sistema al abrir modal
  const openCoverModal = async () => {
    setShowCoverModal(true);
    const res = await fetch("http://localhost:5214/api/upload/portada"); // <-- Cambia aquí
    const images = await res.json();
    setSystemImages(images);
  };

  // Manejar archivo nuevo (subida de portada)
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setSelectedSystemImage(null);

      // Subir la imagen a la carpeta de portadas
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:5214/api/upload/portada", {
        method: "POST",
        body: formData,
      });
      const data = await res.json(); // <--- CAMBIA ESTO
      setCourse((prev: any) => ({ ...prev, coverImage: data.url }));
      setCoverPreview(data.url);
    }
  };

  // Usar imagen seleccionada del sistema
  const handleUseSelectedCover = () => {
    if (selectedSystemImage) {
      setCoverPreview(selectedSystemImage);
      setCoverFile(null);
      setCourse((prev: any) => ({ ...prev, coverImage: selectedSystemImage }));
    }
    setShowCoverModal(false);
  };

  // Borrar imagen del sistema
  const handleDeleteSystemImage = async () => {
    if (!selectedSystemImage) return;
    await fetch("http://localhost:5214/api/upload/portada", { // <-- Cambia aquí
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: selectedSystemImage }),
    });
    // Actualiza la lista de imágenes
    const res = await fetch("http://localhost:5214/api/upload/portada"); // <-- Cambia aquí
    const images = await res.json();
    setSystemImages(images);
    setSelectedSystemImage(null);
    setCoverPreview(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título del curso</Label>
        <Input
          id="title"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={course.category && course.category !== "" ? course.category : "__placeholder__"}
            onValueChange={(value) =>
              setCourse({ ...course, category: value === "__placeholder__" ? undefined : value })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__placeholder__" disabled>
                Selecciona una categoría
              </SelectItem>
              {categories
                .filter((cat) => cat && cat !== "")
                .map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {/* Instructor */}
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Select
            value={course.instructor && course.instructor !== "" ? course.instructor : "__placeholder__"}
            onValueChange={(value) =>
              setCourse({ ...course, instructor: value === "__placeholder__" ? undefined : value })
            }
          >
            <SelectTrigger id="instructor">
              <SelectValue placeholder="Selecciona un instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__placeholder__" disabled>
                Selecciona un instructor
              </SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.nombre}>
                  {teacher.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Fecha de inicio */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={course.startDate}
            onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
          />
        </div>
        {/* Fecha de fin */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={course.endDate}
            onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
          />
        </div>
        {/* Horario */}
        <div className="space-y-2">
          <Label htmlFor="schedule">Horario</Label>
          <Input
            id="schedule"
            value={course.schedule}
            onChange={(e) => setCourse({ ...course, schedule: e.target.value })}
            placeholder="Ej: Lun, Mié 15:00-17:00"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="coverImage">Imagen de portada</Label>
        <div className="mt-2 flex flex-col gap-4">
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Vista previa portada"
              className="h-40 w-full object-cover rounded-md"
            />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={openCoverModal}
          >
            Seleccionar o subir imagen de portada
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Objetivos del curso</Label>
        <div className="space-y-2">
          {course.objectives.map((objective: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...course.objectives];
                  newObjectives[index] = e.target.value;
                  setCourse({ ...course, objectives: newObjectives });
                }}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newObjectives = course.objectives.filter((_: string, i: number) => i !== index);
                  setCourse({ ...course, objectives: newObjectives });
                }}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCourse({
                ...course,
                objectives: [...course.objectives, "Nuevo objetivo"]
              });
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Añadir objetivo
          </Button>
        </div>
      </div>

      {/* Modal para seleccionar o subir imagen de portada */}
      <Dialog open={showCoverModal} onOpenChange={setShowCoverModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona o sube una imagen de portada</DialogTitle>
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
                  alt="Imagen del sistema"
                  className={`w-24 h-24 object-cover rounded cursor-pointer border ${selectedSystemImage === url ? "border-primary" : "border-gray-200"}`}
                  onClick={() => setSelectedSystemImage(url)}
                />
              ))}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
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
              onClick={handleUseSelectedCover}
            >
              Usar imagen seleccionada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseInfoForm;