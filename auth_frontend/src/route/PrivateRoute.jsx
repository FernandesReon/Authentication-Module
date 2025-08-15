import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = ({ requireAdmin = false }) => {
    const { isAuthenticated, isLoading, user } = useContext(AuthContext);
    console.log('PrivateRoute: isLoading=', isLoading, 'isAuthenticated=', isAuthenticated); // Debug log

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && !(user?.roles?.includes('ADMIN') || user?.role === 'admin')) {
        return <Navigate to="/user-profile" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;