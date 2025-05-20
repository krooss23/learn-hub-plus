import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon } from "lucide-react";
import CourseGrid from "@/components/courses/CourseGrid";
import { useState, useEffect } from "react";

const Courses = () => {
  const [userRole, setUserRole] = useState<"estudiante" | "profesor" | "admin">("estudiante");
  const [courses, setCourses] = useState<any[]>([]);

  // 1. Función para cargar cursos
  const fetchCourses = () => {
    fetch("http://localhost:5214/api/courses")
      .then(res => res.json())
      .then(data => {
        // Mapea los datos del backend al formato del frontend
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.nombre,
          instructor: course.profesor,
          coverImage: course.imagenUrl,
          category: course.categoria,
          startDate: course.fechaInicio,
          schedule: course.horario,
          // agrega otros campos si los necesitas
        }));
        setCourses(mappedCourses);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // For demonstration purposes, add buttons to switch between roles
  const handleRoleChange = (role: "estudiante" | "profesor" | "admin") => {
    setUserRole(role);
  };

  return (
    <MainLayout>
      {/* Role switcher for demo purposes */}
      <div className="mb-6 p-3 bg-gray-100 rounded-md">
        <p className="text-xs text-muted-foreground mb-2">
          Demo: Cambiar de rol para ver diferentes vistas
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleChange("estudiante")}
            className={`px-3 py-1 rounded text-sm ${
              userRole === "estudiante"
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Estudiante
          </button>
          <button
            onClick={() => handleRoleChange("profesor")}
            className={`px-3 py-1 rounded text-sm ${
              userRole === "profesor"
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Profesor
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Cursos</h1>
        
        {userRole === "profesor" && (
          <Link to="/courses/create">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon className="h-4 w-4 mr-2" />
              Crear Nuevo Curso
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar cursos..." 
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="matematicas">Matemáticas</SelectItem>
              <SelectItem value="ciencias">Ciencias</SelectItem>
              <SelectItem value="historia">Historia</SelectItem>
              <SelectItem value="literatura">Literatura</SelectItem>
              <SelectItem value="idiomas">Idiomas</SelectItem>
              <SelectItem value="tecnologia">Tecnología</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
              {userRole === "estudiante" && (
                <SelectItem value="progress">Progreso</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <CourseGrid courses={courses} role={userRole} />
    </MainLayout>
  );
};

export default Courses;
