import React, { Component }  from 'react';
import { Navigate } from 'react-router-dom';
import authVerify from './auth-verify';

const PrivateRoute = ({ isAllowed, children, redirectTo }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  if(user === null) return <Navigate to={redirectTo} replace />;
  return children;
};

export default PrivateRoute;