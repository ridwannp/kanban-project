import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoutes from "../services/PrivateRoutes";
import { useAuth } from "../services/AuthContext";
import NavbarComponent from "./NavbarComponent";
import Register from "../pages/Register";
import ReportPage from "../pages/Report/ReportPage";

const AppContent = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    if (currentUser !== user) {
      setUser(currentUser);
    }
    setLoading(false);
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && location.pathname === "/login" ? (
        <Navigate to="/dashboard" replace />
      ) : (
        user && <NavbarComponent />
      )}
      <div>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={
              !user ? <Register /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoutes>
                <Dashboard />
              </PrivateRoutes>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoutes>
                <ReportPage />
              </PrivateRoutes>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default AppContent;
