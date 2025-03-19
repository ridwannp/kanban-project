import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import NavbarComponent from "./components/NavbarComponent";
import AppContent from "./components/AppContent";
import { AuthProvider } from "./services/AuthContext";
import PrivateRoutes from "./services/PrivateRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
