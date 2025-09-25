
import React from 'react'
import { Navigate } from "react-router-dom";
function Authmiddleware({children}:{children:any}) {
  
    const token = localStorage.getItem("token");
    console.log("TOKEN = ", token);
    if(!token){

        return <Navigate to="/sign-in" replace />;
    }
     
    return children
}

export default Authmiddleware

