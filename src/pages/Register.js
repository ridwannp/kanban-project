import React, { useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { Eye, EyeSlash } from "react-bootstrap-icons";

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
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="Name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group id="confirm-password">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group id="role">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </Form.Select>
          </Form.Group>
          <Button disabled={loading} className="w-100 mt-3" type="submit">
            Register
          </Button>
        </Form>
        <div className="w-100 text-center mt-3">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Register;
