import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { GoogleAuth } from './GoogleAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In / Sign Up</CardTitle>
            <CardDescription>
              Sign in or create an account with Google to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleAuth
              onSuccess={(user: User) => {
                // Redirect will happen automatically via state update
                window.location.reload();
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

