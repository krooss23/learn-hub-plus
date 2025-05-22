import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";

const NewUser = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-2xl font-bold text-kampus-primary">
          Aurum INC
        </Link>
      </div>
    </header>
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <RegisterForm />
    </div>
  </div>
);

export default NewUser;
