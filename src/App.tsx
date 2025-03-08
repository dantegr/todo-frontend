import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useAuth } from "./stores/AuthContext";

const App: React.FC = () => {
  const { accessToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  ///todo create a validate token route
  useEffect(() => {
    if (accessToken !== null) {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  return (
    <>
      <Routes>
        <Route
          path="login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="register" element={<Register />} />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  );
};

export default App;
