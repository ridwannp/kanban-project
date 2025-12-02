import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { Eye, EyeSlash, Person, Envelope, Lock, Briefcase } from "react-bootstrap-icons";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(email, password, role);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  return (
    <Container fluid className="auth-container p-0">
      <Row className="auth-row m-0">
        <Col md={7} lg={8} className="auth-image-side d-none d-md-block">
          <div
            className="auth-bg-image"
            style={{ backgroundImage: `url('/assets/img/kanban.jpg')` }}
          />
          <div className="auth-overlay">
            <h1 className="auth-quote">"Start your journey with us."</h1>
            <p className="auth-quote-sub">Join thousands of teams managing their projects efficiently and effectively.</p>
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
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">
                Get started with your free account today.
              </p>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="auth-form-group">
                <Form.Label className="auth-label">Full Name</Form.Label>
                <div className="auth-input-group">
                  <Person className="auth-icon" size={20} />
                  <Form.Control
                    className="auth-input"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

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
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="auth-form-group">
                <Form.Label className="auth-label">Confirm Password</Form.Label>
                <div className="auth-input-group">
                  <Lock className="auth-icon" size={20} />
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="auth-form-group">
                <Form.Label className="auth-label">Role</Form.Label>
                <div className="auth-input-group">
                  <Briefcase className="auth-icon" size={20} />
                  <Form.Select
                    className="auth-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="manager">Manager</option>
                    <option value="sales">Sales</option>
                    <option value="multimedia">Multimedia</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <div className="d-grid gap-3 mt-4">
                <Button disabled={loading} className="auth-btn-primary" type="submit">
                  {loading ? "Creating Account..." : "Register"}
                </Button>
              </div>
            </Form>
            
            <div className="auth-footer">
              Already have an account? <Link to="/login" className="auth-link">Log In</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
