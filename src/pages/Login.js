import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Button, Col, Row, Container, Form, Alert } from "react-bootstrap";
import { Envelope, Lock, BoxArrowInRight } from "react-bootstrap-icons";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login gagal! Periksa kembali email dan password.");
    }
    setLoading(false);
  };

  return (
    <Container fluid className="auth-container p-0">
      <Row className="auth-row m-0">
        <Col md={7} lg={8} className="auth-image-side d-none d-md-block">
          <div
            className="auth-bg-image"
            style={{ backgroundImage: `url('/assets/img/project.jpg')` }}
          />
          <div className="auth-overlay">
            {/* <h1 className="auth-quote">"Productivity is never an accident."</h1>
            <p className="auth-quote-sub">
              It is always the result of a commitment to excellence, intelligent
              planning, and focused effort.
            </p> */}
          </div>
        </Col>
        <Col md={5} lg={4} className="auth-form-side">
          <div className="auth-form-container">
            {/* <div className="text-center">
              <img
                src={"/assets/img/logo.png"}
                alt="Logo"
                className="auth-logo"
              />
            </div> */}
            <div className="mb-4">
              <h2 className="auth-title">Welcome Back!</h2>
              <p className="auth-subtitle">
                Please login to access your project management dashboard.
              </p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="auth-form-group">
                <Form.Label className="auth-label">Email Address</Form.Label>
                <div className="auth-input-group">
                  <Envelope className="auth-icon" size={20} />
                  <Form.Control
                    type="email"
                    className="auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="auth-form-group">
                <Form.Label className="auth-label">Password</Form.Label>
                <div className="auth-input-group">
                  <Lock className="auth-icon" size={20} />
                  <Form.Control
                    type="password"
                    className="auth-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <div className="d-grid gap-3 mt-4">
                <Button
                  type="submit"
                  className="auth-btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <BoxArrowInRight className="me-2" /> Login
                    </>
                  )}
                </Button>
                <Link
                  to="/register"
                  className="btn auth-btn-secondary d-flex align-items-center justify-content-center text-decoration-none"
                >
                  Create an Account
                </Link>
              </div>
            </Form>

            <div className="auth-footer">
              <p>&copy; {new Date().getFullYear()} Project Management App</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
