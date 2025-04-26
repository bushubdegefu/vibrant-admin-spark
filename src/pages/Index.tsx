
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/api";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated, redirect accordingly
    if (authService.isAuthenticated()) {
      navigate('/admin/users');
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    </div>
  );
};

export default Index;
