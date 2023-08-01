import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import store from './store';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    const user = state.user; 
    let isLoggedIn = false;
    if(user[0]){
        isLoggedIn = true; 
    } else {
        isLoggedIn = false;
    }

    return (isLoggedIn) ? <Outlet /> : <Navigate to="/" />;
  
};

export default PrivateRoute;