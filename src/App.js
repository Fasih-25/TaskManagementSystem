import './App.css';
import React from 'react';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from './login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {

  return (
     <HashRouter>
       <Routes>
         <Route  path="/" name="Login Page" element={<Login />} />
         <Route  exact path="/dashboard" name="Dashboard"  element={ <PrivateRoute/>}>
             <Route  path="/dashboard" name="Dashboard"  element={<Dashboard />} />
         </Route>
       </Routes>
   </HashRouter>
  );
}

export default App;
