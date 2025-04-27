// routes/protectedLoader.js
import { redirect } from "react-router-dom";

export const protectedLoader = () => {
  // Check if the token exists in localStorage
  const token = localStorage.getItem("token");
  
  if (!token) {
    return redirect("/login");
  }
  return null
};


// utils/auth.js
export const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // true or false
  };
  