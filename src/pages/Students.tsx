import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, Flag, MapPin, Building, Briefcase, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    pais: "all",
    region: "all",
    ciudad: "all",
    concesionario: "all",
    empresa: "all",
    tipo: "all",
  });
  const [studentsList, setStudentsList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5214/api/users")
      .then(res => res.json())
      .then(data => {
        // Solo usuarios con rol estudiante
        const estudiantes = data.filter((u: any) => u.rol === "estudiante");
        setStudentsList(estudiantes);
      });
  }, []);

  // Filter students based on search query and filters
  const filteredStudents = studentsList.filter(student => {
    const fullName = `${student.nombre} ${student.apellidos}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters = 
      (filters.pais === "all" ? true : student.pais === filters.pais) &&
      (filters.region === "all" ? true : student.region === filters.region) &&
      (filters.ciudad === "all" ? true : student.ciudad === filters.ciudad) &&
      (filters.concesionario === "all" ? true : student.concesionario === filters.concesionario) &&
      (filters.empresa === "all" ? true : student.empresa === filters.empresa) &&
      (filters.tipo === "all" ? true : student.tipo === filters.tipo);

    return matchesSearch && matchesFilters;
  });

  // Get unique values for filters
  const countries = [...new Set(studentsList.map(s => s.pais))];
  const regions = [...new Set(studentsList.map(s => s.region))];
  const cities = [...new Set(studentsList.map(s => s.ciudad))];
  const dealerships = [...new Set(studentsList.map(s => s.concesionario))];
  const companies = [...new Set(studentsList.map(s => s.empresa))];

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      pais: "all",
      region: "all",
      ciudad: "all",
      concesionario: "all",
      empresa: "all",
      tipo: "all",
    });
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Estudiantes</h1>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar estudiantes..." 
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
                <SelectItem value="all">Todos los países</SelectItem>
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
                <SelectItem value="all">Todas las regiones</SelectItem>
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
                <SelectItem value="all">Todas las ciudades</SelectItem>
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
                <SelectItem value="all">Todos los concesionarios</SelectItem>
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
                <SelectItem value="all">Todas las empresas</SelectItem>
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

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <Card key={student.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={student.avatar} alt={`${student.nombre} ${student.apellidos}`} />
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(`${student.nombre} ${student.apellidos}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{student.nombre} {student.apellidos}</h3>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="capitalize">
                      {student.tipo}
                    </Badge>
                    <Badge variant="outline">{student.pais}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Concesionario</p>
                  <p>{student.concesionario}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Empresa</p>
                  <p>{student.empresa}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Progreso</p>
                  <p>{student.progress}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cursos completados</p>
                  <p>{student.completedCourses} de {student.enrolledCourses}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Ver perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No se encontraron estudiantes con los filtros seleccionados.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Students;
