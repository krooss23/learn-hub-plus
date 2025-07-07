import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Usa imágenes públicas de Unsplash como ejemplo para que el sistema funcione
const heroBuilding = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
const studentsImage = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#181b20] text-slate-200 flex flex-col">
      {/* Header */}
      <header className="bg-[#181b20]/95 backdrop-blur-sm border-b border-[#232733] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <span className="text-3xl font-extrabold text-[#2563eb]">Aurum INC</span>
            <nav className="hidden md:flex space-x-6">
              <a href="#inicio" className="text-slate-400 hover:text-[#2563eb] transition-colors">Inicio</a>
              <a href="#caracteristicas" className="text-slate-400 hover:text-[#2563eb] transition-colors">Características</a>
              <a href="#precios" className="text-slate-400 hover:text-[#2563eb] transition-colors">Precios</a>
              <a href="#contacto" className="text-slate-400 hover:text-[#2563eb] transition-colors">Contacto</a>
            </nav>
          </div>
          <Button
            variant="default"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition-opacity"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="inicio">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBuilding}
            alt="Modern educational facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#181b20]/90"></div>
        </div>
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Plataforma Educativa{" "}
                <span className="text-[#2563eb]">Integral</span>
              </h1>
              <p className="text-xl text-slate-200 mb-8 leading-relaxed max-w-lg">
                Gestiona el aprendizaje, la comunicación y el progreso académico con una experiencia digital moderna y profesional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-8 py-6"
                >
                  Conocer Aurum INC
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]/10 font-bold px-8 py-6"
                >
                  Saber Más
                </Button>
              </div>
            </div>
            {/* Feature highlight */}
            <div className="hidden lg:block">
              <div className="bg-[#232733]/90 border-none rounded-2xl p-8 shadow-glow">
                <h3 className="text-xl font-semibold mb-4 text-[#2563eb]">
                  Instalaciones modernas y tecnología de punta
                </h3>
                <p className="text-slate-200">
                  Nuestras instalaciones cuentan con la tecnología más avanzada para brindar una experiencia educativa de excelencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#232733]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight text-white">
                Una experiencia educativa{" "}
                <span className="text-[#2563eb]">
                  moderna y profesional
                </span>
              </h2>
              <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                En Aurum INC transformamos la educación tradicional a través de tecnología avanzada y metodologías innovadoras que preparan a los estudiantes para el futuro.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="text-slate-200">Plataforma integral de gestión educativa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="text-slate-200">Tecnología de vanguardia en educación</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="text-slate-200">Soporte técnico especializado 24/7</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={studentsImage}
                alt="Students collaborating"
                className="rounded-2xl shadow-card w-full"
              />
              <div className="absolute inset-0 bg-[#2563eb]/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#181b20]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "15K+", label: "Estudiantes Activos" },
              { number: "500+", label: "Cursos Disponibles" },
              { number: "98%", label: "Satisfacción Estudiantil" },
              { number: "24/7", label: "Soporte Técnico" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#2563eb] mb-4">
                  {stat.number}
                </div>
                <div className="text-slate-200 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-24 bg-[#181b20]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 text-[#2563eb]">
              Características Destacadas
            </h2>
            <p className="text-2xl text-slate-200 max-w-3xl mx-auto">
              Herramientas integradas que transforman la manera de enseñar y aprender
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Gestión de Cursos",
                description: "Organiza, administra y comparte materiales didácticos en múltiples formatos."
              },
              {
                icon: MessageCircle,
                title: "Comunicación",
                description: "Foros, mensajería y notificaciones para mantener a todos conectados."
              },
              {
                icon: GraduationCap,
                title: "Evaluaciones",
                description: "Exámenes, tareas y retroalimentación detallada, todo en un solo lugar."
              },
              {
                icon: Users,
                title: "Colaboración",
                description: "Herramientas para proyectos colaborativos y seguimiento de participación."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#232733] border-none rounded-2xl p-8 shadow-glow flex flex-col items-start"
              >
                <div className="bg-[#181b20] w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10 text-[#2563eb]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2563eb]">
                  {feature.title}
                </h3>
                <p className="text-slate-200 leading-relaxed text-left text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#232733] border-t border-[#232733] py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-[#2563eb] mb-4">
                Aurum INC
              </h3>
              <p className="text-slate-200 leading-relaxed">
                La plataforma educativa integral para instituciones modernas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-slate-200 hover:text-[#2563eb] transition-colors">Inicio</a></li>
                <li><a href="#caracteristicas" className="text-slate-200 hover:text-[#2563eb] transition-colors">Características</a></li>
                <li><a href="#precios" className="text-slate-200 hover:text-[#2563eb] transition-colors">Precios</a></li>
                <li><a href="#contacto" className="text-slate-200 hover:text-[#2563eb] transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-200 hover:text-[#2563eb] transition-colors">Términos de Servicio</a></li>
                <li><a href="#" className="text-slate-200 hover:text-[#2563eb] transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="text-slate-200 hover:text-[#2563eb] transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-slate-200">
                <li>info@auruminc.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Ciudad de México, México</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#232733] pt-8 text-center text-slate-400">
            © 2025 Aurum INC. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
