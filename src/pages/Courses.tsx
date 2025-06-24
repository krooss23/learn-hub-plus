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

  // Obtén el usuario desde localStorage
  const user = (() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  })();

  // Función para cargar cursos asignados al estudiante
  const fetchStudentCourses = () => {
    if (!user || !user.id) return; // <-- Asegúrate de esto
    fetch(`http://localhost:5214/api/users/${user.id}/courses`)
      .then(res => res.json())
      .then(data => {
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.nombre,
          instructor: course.profesor,
          coverImage: course.imagenUrl,
          category: course.categoria,
          startDate: course.fechaInicio,
          schedule: course.horario,
        }));
        setCourses(mappedCourses);
      })
      .catch(err => console.error(err));
  };

  // Función para cargar todos los cursos (profesor/admin)
  const fetchCourses = () => {
    fetch("http://localhost:5214/api/courses")
      .then(res => res.json())
      .then(data => {
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.nombre,
          instructor: course.profesor,
          coverImage: course.imagenUrl,
          category: course.categoria,
          startDate: course.fechaInicio,
          schedule: course.horario,
        }));
        setCourses(mappedCourses);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (userRole === "estudiante") {
      fetchStudentCourses();
    } else {
      fetchCourses();
    }
    // eslint-disable-next-line
  }, [userRole]);

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
      
      {userRole === "profesor" || userRole === "admin" ? (
        <div className="flex flex-col gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border">
              <img
                src={course.coverImage || "/placeholder.svg"}
                alt={course.title}
                className="w-28 h-28 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{course.title}</h2>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{course.category}</span>
                </div>
                <div className="text-sm text-gray-500">Instructor: {course.instructor}</div>
                <div className="text-xs text-gray-400 mt-1">
                  <span>Inicio: {course.startDate}</span>
                </div>
                <div className="text-xs text-gray-400">{course.schedule}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Ver</Button>
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="destructive" size="sm">Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CourseGrid courses={courses} role={userRole} />
      )}
    </MainLayout>
  );
};

export default Courses;
