import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRouteAccess, isAuthenticated } from "../services/auth";
import LoadingScreen from "./LoadingScreen";

const PrivateRoute = ({ children, requiredType }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    checkRouteAccess(requiredType)
      .then((res) => {
        if (!res.hasAccess) {
          navigate(res.redirectTo, { replace: true });
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate, requiredType]);

  if (!isAuthenticated()) return null;
  if (authorized === null) return <LoadingScreen message="Verificando acceso..." />;
  return children;
};

export default PrivateRoute;
