import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
