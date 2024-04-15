import React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const withRouter = (Component) => {
  const ComponentWithRouterProp =(props) =>{
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    const reload = () => {
      navigate(location.pathname);
    }

    return <Component {...props} router={{ location, navigate, params, reload }} />;
  }
  return ComponentWithRouterProp;
};