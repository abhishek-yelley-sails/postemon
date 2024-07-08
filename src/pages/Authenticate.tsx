import { Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthContextProvider";
import { Navigate } from "react-router-dom";

export default function Authenticate() {
  const authCtx = useAuth();

  if (authCtx?.getToken()) {
    return (
      <Outlet />
    );
  }
  return (
    <Navigate to="/auth?mode=login" />
  );

}