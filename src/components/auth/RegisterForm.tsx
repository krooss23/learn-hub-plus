import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const countries = [
  "Chile", "Argentina", "Perú", "Colombia", "México", "España", "Estados Unidos"
];

type Empresa = {
  id: number;
  nombre: string;
};

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [senceNet, setSenceNet] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("activo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("estudiante");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empresaId, setEmpresaId] = useState<string>("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch("http://localhost:5214/api/empresas")
      .then((res) => res.json())
      .then((data) => {
        // Si la respuesta es un array directo
        if (Array.isArray(data)) setEmpresas(data);
        // Si la respuesta es { data: [...] }
        else if (data.data && Array.isArray(data.data)) setEmpresas(data.data);
        else setEmpresas([]);
      })
      .catch(() => setEmpresas([]));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    fetch("http://localhost:5214/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: name,
        apellidos: lastName,
        senceNet: senceNet,
        pais: country,
        estado: status,
        email: email,
        password: password,
        rol: role,
        empresaId: empresaId ? Number(empresaId) : null,
      }),
    })
      .then(res => {
        setIsLoading(false);
        if (!res.ok) throw new Error("Error");
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente",
        });
        setName("");
        setLastName("");
        setSenceNet("");
        setCountry("");
        setStatus("activo");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("estudiante");
        setEmpresaId("");
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No se pudo crear el usuario",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto py-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
        <CardDescription className="text-center">
          Registro para acceder a Aurum INC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Pérez González"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="senceNet">SenceNet</Label>
              <Input
                id="senceNet"
                type="text"
                placeholder="SenceNet"
                value={senceNet}
                onChange={(e) => setSenceNet(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Select value={country} onValueChange={setCountry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudiante">Estudiante</SelectItem>
                  <SelectItem value="profesor">Profesor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Correo y Empresa en la misma fila */}
            <div className="flex flex-col">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={empresaId} onValueChange={setEmpresaId} required>
                <SelectTrigger>
                  <SelectValue placeholder={empresas.length === 0 ? "No hay empresas registradas" : "Selecciona una empresa"} />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </span>
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            Crear Usuario
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
