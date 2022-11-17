import React, { Component }  from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAllowed, children, redirectTo }) => {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return children;
};

export default PrivateRoute;