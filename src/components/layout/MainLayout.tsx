
import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main 
          className={`flex-1 overflow-auto p-4 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "ml-64" : isMobile ? "ml-0" : "ml-20"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
