
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ManageCoursesFilters from "@/components/courses/ManageCoursesFilters";
import CourseList from "@/components/courses/CourseList";

// Mock data for courses
const allCourses = [
  {
    id: "1",
    title: "Matemáticas Avanzadas",
    instructor: "Carlos Mendoza",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Matemáticas",
    students: 28,
    startDate: "10/05/2025",
    schedule: "Lun, Mié 15:00-17:00",
    pais: "España",
    region: "Cataluña",
    ciudad: "Barcelona",
    concesionario: "AutoMax",
    empresa: "VehicleOne",
    tipo: "tecnico",
    status: "active",
  },
  {
    id: "2",
    title: "Historia Universal",
    instructor: "Ana García",
    coverImage: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    category: "Historia",
    students: 19,
    startDate: "05/05/2025",
    schedule: "Mar, Jue 10:00-12:00",
    pais: "México",
    region: "Ciudad de México",
    ciudad: "Miguel Hidalgo",
    concesionario: "CarWorld",
    empresa: "AutoGroup",
    tipo: "asesor",
    status: "active",
  },
  {
    id: "3",
    title: "Programación en Python",
    instructor: "Ricardo Torres",
    coverImage: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    category: "Tecnología",
    students: 35,
    startDate: "15/05/2025",
    schedule: "Vie 14:00-18:00",
    pais: "Colombia",
    region: "Bogotá",
    ciudad: "Chapinero",
    concesionario: "CarDrive",
    empresa: "VehicleTech",
    tipo: "tecnico",
    status: "active",
  },
  {
    id: "4",
    title: "Ventas y Atención al Cliente",
    instructor: "Laura Sánchez",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Negocios",
    students: 42,
    startDate: "20/05/2025",
    schedule: "Lun, Mié, Vie 16:00-18:00",
    pais: "Argentina",
    region: "Buenos Aires",
    ciudad: "La Plata",
    concesionario: "AutoDrive",
    empresa: "MotorCorp",
    tipo: "ventas",
    status: "draft",
  },
];

const ManageCourses = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    pais: "",
    region: "",
    ciudad: "",
    concesionario: "",
    empresa: "",
    tipo: "",
  });

  // Filter courses based on search and filters
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.pais ? course.pais === filters.pais : true) &&
      (filters.region ? course.region === filters.region : true) &&
      (filters.ciudad ? course.ciudad === filters.ciudad : true) &&
      (filters.concesionario ? course.concesionario === filters.concesionario : true) &&
      (filters.empresa ? course.empresa === filters.empresa : true) &&
      (filters.tipo ? course.tipo === filters.tipo : true);
    
    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      pais: "",
      region: "",
      ciudad: "",
      concesionario: "",
      empresa: "",
      tipo: "",
    });
    setSearchQuery("");
  };

  const handleDeleteCourse = (id: string) => {
    // In a real app, you would call your API to delete the course
    toast({
      title: "Curso eliminado",
      description: "El curso ha sido eliminado correctamente.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestionar Cursos</h1>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link to="/courses/create">
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear Nuevo Curso
          </Link>
        </Button>
      </div>
      
      {/* Search and filters */}
      <ManageCoursesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        allCourses={allCourses}
      />

      {/* Course list */}
      <CourseList 
        courses={filteredCourses}
        onDelete={handleDeleteCourse}
      />
    </MainLayout>
  );
};

export default ManageCourses;
