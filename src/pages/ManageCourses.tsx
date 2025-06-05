import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon } from "lucide-react";
import CourseGrid from "@/components/courses/CourseGrid";
import { useState, useEffect } from "react";
import { Flag, MapPin, Building, Briefcase, Pen as PenIcon, Trash2 as Trash2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const ManageCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    pais: "",
    region: "",
    ciudad: "",
    concesionario: "",
    empresa: "",
    tipo: "",
  });

  // Cargar cursos reales desde la API
  useEffect(() => {
    fetch("http://localhost:5214/api/courses")
      .then(res => res.json())
      .then(data => {
        // Ajusta los nombres según lo que devuelve tu backend
        const mapped = data.map((course: any) => ({
          id: course.id,
          title: course.nombre || course.title,
          instructor: course.profesor || course.instructor,
          coverImage: course.imagenUrl || course.coverImage,
          category: course.categoria || course.category,
          students: course.estudiantes || course.students,
          startDate: course.fechaInicio || course.startDate,
          status: course.estado || course.status,
          pais: course.pais,
          region: course.region,
          ciudad: course.ciudad,
          concesionario: course.concesionario,
          empresa: course.empresa,
          tipo: course.tipo,
        }));
        setCourses(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Filtrar cursos igual que hacías con allCourses
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters =
      (filters.pais ? course.pais === filters.pais : true) &&
      (filters.region ? course.region === filters.region : true) &&
      (filters.ciudad ? course.ciudad === filters.ciudad : true) &&
      (filters.concesionario ? course.concesionario === filters.concesionario : true) &&
      (filters.empresa ? course.empresa === filters.empresa : true) &&
      (filters.tipo ? course.tipo === filters.tipo : true);

    return matchesSearch && matchesFilters;
  });

  // Obtén los valores únicos para los selects desde courses
  const countries = [...new Set(courses.map(c => c.pais).filter(Boolean))];
  const regions = [...new Set(courses.map(c => c.region).filter(Boolean))];
  const cities = [...new Set(courses.map(c => c.ciudad).filter(Boolean))];
  const dealerships = [...new Set(courses.map(c => c.concesionario).filter(Boolean))];
  const companies = [...new Set(courses.map(c => c.empresa).filter(Boolean))];

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
        <Link to="/courses/create">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear Nuevo Curso
          </Button>
        </Link>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="asesor">Asesor</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {filteredCourses.map(course => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40 relative">
                  {/* Imagen con fallback */}
                  <img 
                    src={course.coverImage || "/images/INClogo.png"} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/course/${course.id}`}>
                          Ver
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/course/${course.id}/manage`}>
                          <PenIcon className="h-4 w-4 mr-1" />
                          Editar
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2Icon className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Categoría</p>
                      <p className="text-sm">{course.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estudiantes</p>
                      <p className="text-sm">{course.students}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Inicio</p>
                      {/* Fecha solo con día (sin hora) */}
                      <p className="text-sm">{course.startDate?.split("T")[0]}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{course.pais}</Badge>
                    <Badge variant="outline" className="capitalize">{course.tipo}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No se encontraron cursos con los filtros seleccionados.</p>
        </div>
      )}
    </MainLayout>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  if (status === "Activo") {
    return <Badge className="bg-green-500 text-white">Activo</Badge>;
  }
  if (status === "Inactivo") {
    return <Badge className="bg-gray-400 text-white">Inactivo</Badge>;
  }
  return null;
};

export default ManageCourses;
