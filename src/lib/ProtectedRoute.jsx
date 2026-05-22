import { useAuth } from "../utils/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
