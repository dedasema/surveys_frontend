import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRouteAccess } from "../services/auth";
import LoadingScreen from "./LoadingScreen";

const PrivateRoute = ({ children, requiredType }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    checkRouteAccess(requiredType).then((res) => {
      if (!res.hasAccess) {
        navigate(res.redirectTo);
      } else {
        setAuthorized(true);
      }
    });
  }, [navigate, requiredType]);

  if (authorized === null) return <LoadingScreen message="Verificando acceso..." />;
  return children;
};

export default PrivateRoute;
