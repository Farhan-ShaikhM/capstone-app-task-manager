import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait until authentication state is restored
  if (loading) {
    return <p>Loading...</p>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;