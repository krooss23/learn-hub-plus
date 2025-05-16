
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpenIcon, GraduationCapIcon, MessageSquareIcon, UsersIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-kampus-primary">KampusPlus</div>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-kampus-primary hover:bg-blue-600">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-br from-kampus-primary to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tu Plataforma Educativa Integral
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Una solución completa para la gestión del aprendizaje, comunicación académica y seguimiento del progreso educativo.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-kampus-primary hover:bg-gray-100">
                  Comenzar Ahora
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Saber Más
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Estudiantes usando KampusPlus" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-kampus-primary/10 p-4 rounded-full mb-4">
                <BookOpenIcon className="h-10 w-10 text-kampus-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestión de Cursos</h3>
              <p className="text-muted-foreground">
                Crear, organizar y administrar cursos con facilidad. Sube material didáctico en múltiples formatos.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-kampus-secondary/10 p-4 rounded-full mb-4">
                <MessageSquareIcon className="h-10 w-10 text-kampus-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunicación</h3>
              <p className="text-muted-foreground">
                Foros de discusión, mensajería directa y notificaciones para mantener a todos conectados.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-kampus-accent/10 p-4 rounded-full mb-4">
                <GraduationCapIcon className="h-10 w-10 text-kampus-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Evaluaciones</h3>
              <p className="text-muted-foreground">
                Crea exámenes, tareas y cuestionarios con calificación automática o manual con retroalimentación detallada.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <UsersIcon className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Colaboración</h3>
              <p className="text-muted-foreground">
                Herramientas para trabajo en equipo, proyectos colaborativos y seguimiento de la participación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lo Que Dicen Nuestros Usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kampus-primary rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">María Rodríguez</h4>
                  <p className="text-sm text-muted-foreground">Profesora de Ciencias</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "KampusPlus ha transformado la manera en que imparto mis clases. La facilidad para compartir materiales y dar seguimiento al progreso de mis estudiantes es incomparable."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kampus-secondary rounded-full flex items-center justify-center text-white font-bold">
                  JL
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">José López</h4>
                  <p className="text-sm text-muted-foreground">Estudiante de Ingeniería</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "La plataforma es muy intuitiva y me permite organizar todos mis cursos en un solo lugar. Los foros de discusión son especialmente útiles para resolver dudas rápidamente."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kampus-accent rounded-full flex items-center justify-center text-white font-bold">
                  AG
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Ana Gómez</h4>
                  <p className="text-sm text-muted-foreground">Directora Académica</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Desde que implementamos KampusPlus en nuestra institución, hemos visto una mejora significativa en la comunicación entre profesores y estudiantes. Los reportes analíticos son una herramienta invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-kampus-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para Transformar la Experiencia Educativa?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Únete a las instituciones educativas que ya han mejorado su gestión académica con KampusPlus.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-kampus-primary hover:bg-gray-100">
              Registrarse Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KampusPlus</h3>
              <p className="text-gray-400">
                La plataforma educativa integral para instituciones modernas.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Características</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Precios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@kampusplus.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Ciudad de México, México</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2025 KampusPlus. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
