import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated, allowedRoles, userRole }) => {
    if (!isAuthenticated) {
        console.log(!isAuthenticated);
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log(userRole);
        return <Navigate to="/login" />;
    }
    return children;
};

export default PrivateRoute;
