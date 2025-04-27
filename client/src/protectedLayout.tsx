import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "./atoms";
import { Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
export default function ProtectedLayout() {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
}



