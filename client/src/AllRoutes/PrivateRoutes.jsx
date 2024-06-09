
import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
    const isAuth = localStorage.getItem("user")
    return isAuth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
