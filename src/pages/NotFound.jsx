
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center animate-fade-in">
      <div className="glass p-8 rounded-lg max-w-md">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          The page you're looking for doesn't seem to exist.
        </p>
        <Button onClick={() => navigate("/")} className="gap-2">
          <Home size={16} />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
