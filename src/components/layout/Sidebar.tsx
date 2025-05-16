
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BookIcon, 
  CalendarIcon, 
  FileTextIcon, 
  GraduationCapIcon,
  HomeIcon, 
  MessageSquareIcon,
  UsersIcon,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [activeItem, setActiveItem] = useState("home");

  // Mock user role - would come from auth context in a real app
  const userRole = "estudiante"; // or "profesor" or "admin"

  const menuItems = [
    { id: "home", label: "Inicio", icon: HomeIcon, roles: ["estudiante", "profesor", "admin"] },
    { id: "courses", label: "Mis Cursos", icon: BookIcon, roles: ["estudiante", "profesor", "admin"] },
    { id: "calendar", label: "Calendario", icon: CalendarIcon, roles: ["estudiante", "profesor", "admin"] },
    { id: "assignments", label: "Tareas", icon: FileTextIcon, roles: ["estudiante", "profesor"] },
    { id: "messages", label: "Mensajes", icon: MessageSquareIcon, roles: ["estudiante", "profesor", "admin"] },
    { id: "grades", label: "Calificaciones", icon: GraduationCapIcon, roles: ["estudiante"] },
    { id: "students", label: "Estudiantes", icon: UsersIcon, roles: ["profesor", "admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300",
          open 
            ? "w-64" 
            : isMobile 
              ? "-translate-x-full" 
              : "w-20",
          isMobile && open ? "translate-x-0" : ""
        )}
      >
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2" 
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1",
                  !open && !isMobile ? "px-2" : "px-3",
                  activeItem === item.id
                    ? "bg-kampus-primary/10 text-kampus-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => handleItemClick(item.id)}
              >
                <item.icon className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                {(open || isMobile) && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
