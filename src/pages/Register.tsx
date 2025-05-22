
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <header className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-2xl font-bold text-kampus-primary">
            Aurum INC
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
          
         
        </div>
      </main>

      
    </div>
  );
};

export default Register;
