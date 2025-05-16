
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon, Flag, MapPin, Building, Briefcase } from "lucide-react";
import CourseGrid from "@/components/courses/CourseGrid";
import { useState } from "react";

const Courses = () => {
  // For demonstration purposes, we'll use state to toggle between roles
  const [userRole, setUserRole] = useState<"estudiante" | "profesor" | "admin">("estudiante");
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categoria: "all",
    ordenar: "recent",
    pais: "",
    region: "",
    ciudad: "",
    concesionario: "",
    empresa: "",
    tipo: "",
  });
  
  // Mock data for courses
  const studentCourses = [
    {
      id: "1",
      title: "Matemáticas Avanzadas",
      instructor: "Carlos Mendoza",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Matemáticas",
      progress: 75,
      startDate: "10/05/2025",
      schedule: "Lun, Mié 15:00-17:00",
      pais: "España",
      region: "Cataluña", 
      ciudad: "Barcelona",
      concesionario: "AutoMax",
      empresa: "VehicleOne",
      tipo: "tecnico"
    },
    {
      id: "2",
      title: "Historia Universal",
      instructor: "Ana García",
      coverImage: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      category: "Historia",
      progress: 40,
      startDate: "05/05/2025",
      schedule: "Mar, Jue 10:00-12:00",
      pais: "México",
      region: "Ciudad de México",
      ciudad: "Miguel Hidalgo",
      concesionario: "CarWorld",
      empresa: "AutoGroup",
      tipo: "asesor"
    },
    {
      id: "3",
      title: "Programación en Python",
      instructor: "Ricardo Torres",
      coverImage: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      category: "Tecnología",
      progress: 60,
      startDate: "15/05/2025",
      schedule: "Vie 14:00-18:00",
      pais: "Colombia",
      region: "Bogotá",
      ciudad: "Chapinero",
      concesionario: "CarDrive",
      empresa: "VehicleTech",
      tipo: "tecnico"
    },
    {
      id: "4",
      title: "Literatura Hispanoamericana",
      instructor: "Elena Martínez",
      coverImage: "https://images.unsplash.com/photo-1456513080867-f24f12e94d55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
      category: "Literatura",
      progress: 25,
      startDate: "20/05/2025",
      schedule: "Jue 15:00-18:00",
      pais: "Argentina",
      region: "Buenos Aires",
      ciudad: "La Plata",
      concesionario: "AutoDrive",
      empresa: "MotorCorp",
      tipo: "ventas"
    }
  ];
  
  const teacherCourses = [
    {
      id: "1",
      title: "Matemáticas Avanzadas",
      instructor: "Prof. Juan Pérez",
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
      tipo: "tecnico"
    },
    {
      id: "2",
      title: "Álgebra Lineal",
      instructor: "Prof. Juan Pérez",
      coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Matemáticas",
      students: 36,
      startDate: "05/05/2025",
      schedule: "Mar, Jue 10:00-12:00",
      pais: "México",
      region: "Ciudad de México",
      ciudad: "Miguel Hidalgo",
      concesionario: "CarWorld",
      empresa: "AutoGroup",
      tipo: "asesor"
    },
    {
      id: "3",
      title: "Geometría Analítica",
      instructor: "Prof. Juan Pérez",
      coverImage: "https://images.unsplash.com/photo-1636466497217-26a5865ebd3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      category: "Matemáticas",
      students: 22,
      startDate: "15/05/2025",
      schedule: "Vie 14:00-18:00",
      pais: "Colombia",
      region: "Bogotá",
      ciudad: "Chapinero",
      concesionario: "CarDrive",
      empresa: "VehicleTech",
      tipo: "tecnico"
    }
  ];
  
  const availableCourses = [
    {
      id: "5",
      title: "Física I: Mecánica",
      instructor: "Luis Ramírez",
      coverImage: "https://images.unsplash.com/photo-1636466514704-5b34ee678227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      category: "Ciencias",
      startDate: "25/05/2025",
      schedule: "Mar, Jue 13:00-15:00",
      pais: "España",
      region: "Madrid",
      ciudad: "Madrid",
      concesionario: "AutoRent",
      empresa: "CarMotors",
      tipo: "tecnico"
    },
    {
      id: "6",
      title: "Introducción a la Psicología",
      instructor: "Marta González",
      coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Psicología",
      startDate: "01/06/2025",
      schedule: "Lun, Mié 10:00-12:00",
      pais: "México",
      region: "Jalisco",
      ciudad: "Guadalajara",
      concesionario: "CarSales",
      empresa: "AutoDelivery",
      tipo: "asesor"
    },
    {
      id: "7",
      title: "Inglés Avanzado",
      instructor: "Daniel White",
      coverImage: "https://images.unsplash.com/photo-1494809610410-160faaed4de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      category: "Idiomas",
      startDate: "05/06/2025",
      schedule: "Lun, Mié, Vie, 17:00-18:30",
      pais: "Argentina",
      region: "Córdoba",
      ciudad: "Córdoba",
      concesionario: "MotorSales",
      empresa: "CarGroup",
      tipo: "ventas"
    },
    {
      id: "8",
      title: "Economía para Principiantes",
      instructor: "Sofía Herrera",
      coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Economía",
      startDate: "10/06/2025",
      schedule: "Mar, Jue 09:00-11:00",
      pais: "Colombia",
      region: "Antioquia",
      ciudad: "Medellín",
      concesionario: "AutoMax",
      empresa: "VehicleOne",
      tipo: "asesor"
    }
  ];

  // Get unique values for filters
  const getAllCourses = () => [...studentCourses, ...teacherCourses, ...availableCourses];
  const allCourses = getAllCourses();
  
  const countries = [...new Set(allCourses.map(c => c.pais))];
  const regions = [...new Set(allCourses.map(c => c.region))];
  const cities = [...new Set(allCourses.map(c => c.ciudad))];
  const dealerships = [...new Set(allCourses.map(c => c.concesionario))];
  const companies = [...new Set(allCourses.map(c => c.empresa))];

  // Filter courses function
  const filterCourses = (courses: typeof studentCourses) => {
    return courses.filter(course => {
      // Search by title or instructor
      const matchesSearch = 
        !searchQuery || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = 
        filters.categoria === "all" || 
        course.category.toLowerCase() === filters.categoria.toLowerCase();
      
      // Filter by location and type
      const matchesFilters = 
        (filters.pais === "" || course.pais === filters.pais) &&
        (filters.region === "" || course.region === filters.region) &&
        (filters.ciudad === "" || course.ciudad === filters.ciudad) &&
        (filters.concesionario === "" || course.concesionario === filters.concesionario) &&
        (filters.empresa === "" || course.empresa === filters.empresa) &&
        (filters.tipo === "" || course.tipo === filters.tipo);
      
      return matchesSearch && matchesCategory && matchesFilters;
    });
  };

  // Apply filters to courses
  const filteredStudentCourses = filterCourses(studentCourses);
  const filteredTeacherCourses = filterCourses(teacherCourses);
  const filteredAvailableCourses = filterCourses(availableCourses);

  // For demonstration purposes, add buttons to switch between roles
  const handleRoleChange = (role: "estudiante" | "profesor" | "admin") => {
    setUserRole(role);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      categoria: "all",
      ordenar: "recent",
      pais: "",
      region: "",
      ciudad: "",
      concesionario: "",
      empresa: "",
      tipo: "",
    });
    setSearchQuery("");
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
                ? "bg-kampus-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Estudiante
          </button>
          <button
            onClick={() => handleRoleChange("profesor")}
            className={`px-3 py-1 rounded text-sm ${
              userRole === "profesor"
                ? "bg-kampus-primary text-white"
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
            <Button className="bg-kampus-primary hover:bg-blue-600">
              <PlusIcon className="h-4 w-4 mr-2" />
              Crear Nuevo Curso
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search and filter controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cursos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.pais} 
              onValueChange={(value) => handleFilterChange("pais", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-paises">Todos los países</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-regiones">Todas las regiones</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.ciudad} 
              onValueChange={(value) => handleFilterChange("ciudad", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-ciudades">Todas las ciudades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.concesionario} 
              onValueChange={(value) => handleFilterChange("concesionario", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Concesionario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-concesionarios">Todos los concesionarios</SelectItem>
                {dealerships.map(dealership => (
                  <SelectItem key={dealership} value={dealership}>{dealership}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.empresa} 
              onValueChange={(value) => handleFilterChange("empresa", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-empresas">Todas las empresas</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filters.tipo} 
              onValueChange={(value) => handleFilterChange("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-tipos">Todos los tipos</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="asesor">Asesor</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Select 
            value={filters.categoria}
            onValueChange={(value) => handleFilterChange("categoria", value)}
          >
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
          
          <Select 
            value={filters.ordenar}
            onValueChange={(value) => handleFilterChange("ordenar", value)}
          >
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
      
      {userRole === "estudiante" ? (
        <Tabs defaultValue="enrolled">
          <TabsList className="mb-6">
            <TabsTrigger value="enrolled">Mis Cursos</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled">
            <CourseGrid courses={filteredStudentCourses} role="estudiante" />
          </TabsContent>
          
          <TabsContent value="available">
            <CourseGrid courses={filteredAvailableCourses} role="estudiante" />
          </TabsContent>
        </Tabs>
      ) : (
        <CourseGrid courses={filteredTeacherCourses} role="profesor" />
      )}
    </MainLayout>
  );
};

export default Courses;
