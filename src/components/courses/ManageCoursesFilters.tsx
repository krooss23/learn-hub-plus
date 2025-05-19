
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, Flag, MapPin, Building, Briefcase } from "lucide-react";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    pais: string;
    region: string;
    ciudad: string;
    concesionario: string;
    empresa: string;
    tipo: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  resetFilters: () => void;
  allCourses: any[]; // Using any here as it matches the original implementation
}

const ManageCoursesFilters = ({
  searchQuery,
  setSearchQuery,
  filters,
  handleFilterChange,
  resetFilters,
  allCourses,
}: FiltersProps) => {
  // Get unique values for filters
  const countries = [...new Set(allCourses.map(c => c.pais))];
  const regions = [...new Set(allCourses.map(c => c.region))];
  const cities = [...new Set(allCourses.map(c => c.ciudad))];
  const dealerships = [...new Set(allCourses.map(c => c.concesionario))];
  const companies = [...new Set(allCourses.map(c => c.empresa))];

  return (
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
              <SelectItem value="">Todos los países</SelectItem>
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
              <SelectItem value="">Todas las regiones</SelectItem>
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
              <SelectItem value="">Todas las ciudades</SelectItem>
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
              <SelectItem value="">Todos los concesionarios</SelectItem>
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
              <SelectItem value="">Todas las empresas</SelectItem>
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
              <SelectItem value="">Todos los tipos</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
              <SelectItem value="asesor">Asesor</SelectItem>
              <SelectItem value="ventas">Ventas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ManageCoursesFilters;
