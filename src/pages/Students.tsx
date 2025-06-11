import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, Flag, MapPin, Building, Briefcase, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

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
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    nombres: "",
    apellidos: "",
    rut: "",
    pais: "",
    empresa: "",
    concesionario: "",
    tipo: "",
    senceNet: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [empresas, setEmpresas] = useState<{ id: number, nombre: string }[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningStudent, setAssigningStudent] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<{ id: number, nombre: string, categoria: string }[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://localhost:5214/api/users")
      .then(res => res.json())
      .then(data => {
        const estudiantes = data.filter((u: any) => u.rol === "estudiante");
        setStudentsList(estudiantes);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5214/api/empresas")
      .then(res => res.json())
      .then(data => setEmpresas(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5214/api/regiones")
      .then(res => res.json())
      .then(data => setAllCountries(data));
  }, []);

  // Filtros
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

  // Valores únicos para filtros
  const regions = [...new Set(studentsList.map(s => s.region))];
  const cities = [...new Set(studentsList.map(s => s.ciudad))];
  const dealerships = [...new Set(studentsList.map(s => s.concesionario))];
  const companies = [...new Set(studentsList.map(s => s.empresa))];

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

  // CORREGIDO: fetch a /api/courses (no /api/cursos)
  const openAssignModal = (student: any) => {
    setAssigningStudent(student);
    setShowAssignModal(true);
    fetch("http://localhost:5214/api/courses")
      .then(res => res.json())
      .then(data => setAllCourses(data));
    setSelectedCourses([]);
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
            <Button variant="default" onClick={() => setShowModal(true)}>
              Crear estudiante
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
                {allCountries.filter(Boolean).map(country => (
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
                {regions.filter(Boolean).map((region, idx) => (
                  <SelectItem key={`${region}-${idx}`} value={region}>{region}</SelectItem>
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
                {cities.filter(Boolean).map((city, idx) => (
                  <SelectItem key={`${city}-${idx}`} value={city}>{city}</SelectItem>
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
                {dealerships.filter(Boolean).map((dealership, idx) => (
                  <SelectItem key={`${dealership}-${idx}`} value={dealership}>{dealership}</SelectItem>
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
                {companies.filter(Boolean).map((company, idx) => (
                  <SelectItem key={`${company}-${idx}`} value={company}>{company}</SelectItem>
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

      {/* Toasts de éxito y error */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow">
            {successMsg}
          </div>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Modal para crear estudiante */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent aria-describedby="crear-estudiante-desc">
          <DialogHeader>
            <DialogTitle>Crear estudiante</DialogTitle>
          </DialogHeader>
          <div id="crear-estudiante-desc" className="sr-only">
            Formulario para crear un nuevo estudiante.
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSuccessMsg("");
              setErrorMsg("");
              if (newStudent.password !== newStudent.confirmPassword) {
                setErrorMsg("Las contraseñas no coinciden");
                setTimeout(() => setErrorMsg(""), 3000);
                return;
              }
              try {
                const response = await fetch("http://localhost:5214/api/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    Nombre: newStudent.nombres,
                    Apellidos: newStudent.apellidos,
                    Rut: newStudent.rut,
                    Pais: newStudent.pais,
                    Empresa: newStudent.empresa,
                    Concesionario: newStudent.concesionario,
                    Tipo: newStudent.tipo,
                    SenceNet: newStudent.senceNet,
                    Email: newStudent.email,
                    Password: newStudent.password,
                    Rol: "estudiante"
                  }),
                });
                if (response.ok) {
                  const created = await response.json();
                  setStudentsList(prev => [...prev, created]);
                  setShowModal(false);
                  setNewStudent({
                    nombres: "",
                    apellidos: "",
                    rut: "",
                    pais: "",
                    empresa: "",
                    concesionario: "",
                    tipo: "",
                    senceNet: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                  setSuccessMsg("Estudiante creado exitosamente");
                  setTimeout(() => setSuccessMsg(""), 3000);
                } else {
                  setErrorMsg("Error al crear estudiante");
                  setTimeout(() => setErrorMsg(""), 3000);
                }
              } catch (err) {
                setErrorMsg("Error de conexión con el servidor");
                setTimeout(() => setErrorMsg(""), 3000);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Nombres</label>
                <Input
                  value={newStudent.nombres}
                  onChange={e => setNewStudent({ ...newStudent, nombres: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Apellidos</label>
                <Input
                  value={newStudent.apellidos}
                  onChange={e => setNewStudent({ ...newStudent, apellidos: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">RUT</label>
                <Input
                  value={newStudent.rut}
                  onChange={e => setNewStudent({ ...newStudent, rut: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">SenceNet</label>
                <Input
                  value={newStudent.senceNet}
                  onChange={e => setNewStudent({ ...newStudent, senceNet: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">País</label>
                <Select
                  value={newStudent.pais}
                  onValueChange={value => setNewStudent({ ...newStudent, pais: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona país" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCountries.filter(Boolean).map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Tipo</label>
                <Select
                  value={newStudent.tipo}
                  onValueChange={value => setNewStudent({ ...newStudent, tipo: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="asesor">Asesor</SelectItem>
                    <SelectItem value="ventas">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Contraseña</label>
                <Input
                  type="password"
                  value={newStudent.password}
                  onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Confirmar contraseña</label>
                <Input
                  type="password"
                  value={newStudent.confirmPassword}
                  onChange={e => setNewStudent({ ...newStudent, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <Input
                  type="email"
                  value={newStudent.email}
                  onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Empresa</label>
                <Select
                  value={newStudent.empresa}
                  onValueChange={value => setNewStudent({ ...newStudent, empresa: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map(e => (
                      <SelectItem key={e.id} value={e.nombre}>{e.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Concesionario</label>
                <Input
                  value={newStudent.concesionario}
                  onChange={e => setNewStudent({ ...newStudent, concesionario: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para ver perfil de estudiante */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent aria-describedby="ver-perfil-estudiante-desc">
          <DialogHeader>
            <DialogTitle>Perfil del estudiante</DialogTitle>
          </DialogHeader>
          <div id="ver-perfil-estudiante-desc" className="sr-only">
            Visualización de los datos del estudiante seleccionado.
          </div>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedStudent.avatar} alt={`${selectedStudent.nombre} ${selectedStudent.apellidos}`} />
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {getInitials(`${selectedStudent.nombre} ${selectedStudent.apellidos}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-bold text-gray-900">{selectedStudent.nombre} {selectedStudent.apellidos}</div>
                  <div className="text-sm text-gray-500">{selectedStudent.email}</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="capitalize">{selectedStudent.tipo}</Badge>
                    <Badge variant="outline">{selectedStudent.pais}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-500">RUT:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.rut || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">SenceNet:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.senceNet || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Empresa:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.empresa || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Concesionario:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.concesionario || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Progreso:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.progress ?? 0}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Cursos completados:</span>{" "}
                  <span className="text-gray-900">{selectedStudent.completedCourses ?? 0} de {selectedStudent.enrolledCourses ?? 0}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" className="w-full" onClick={() => setShowProfileModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para asignar cursos */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md p-8 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2 text-center">
              Asignar cursos a <span className="text-primary">{assigningStudent?.nombre} {assigningStudent?.apellidos}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Selecciona los cursos</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] bg-gray-50 text-gray-800"
              value={selectedCourses.map(String)}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions, option => Number(option.value));
                setSelectedCourses(options);
              }}
            >
              {allCourses
                .filter(curso => curso.categoria === assigningStudent?.tipo)
                .map(curso => (
                  <option key={curso.id} value={curso.id} className="py-2">
                    {curso.nombre}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Mantén presionada la tecla Ctrl (Windows) o Cmd (Mac) para seleccionar varios cursos.</p>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-primary text-white font-semibold px-6"
              onClick={async () => {
                if (!assigningStudent) return;
                await fetch(`http://localhost:5214/api/users/${assigningStudent.id}/courses`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(selectedCourses),
                });
                setShowAssignModal(false);
                toast({ title: "Cursos asignados correctamente" });
              }}
              disabled={selectedCourses.length === 0}
            >
              Asignar cursos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowProfileModal(true);
                  }}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Ver perfil
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => openAssignModal(student)}
                >
                  Asignar
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
