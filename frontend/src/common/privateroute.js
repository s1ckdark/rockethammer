import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAllowed, children, redirectTo }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user === null ? <Navigate to={redirectTo} replace /> : children;
};

export default PrivateRoute;