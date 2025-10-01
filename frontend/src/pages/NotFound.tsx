import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-8 text-center">
          <h1 className="text-display text-primary mb-4">404</h1>
          <h2 className="text-hero mb-4">Page Not Found</h2>
          <p className="text-body text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="font-secondary font-medium">
            <a href="/">
              Return to Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
