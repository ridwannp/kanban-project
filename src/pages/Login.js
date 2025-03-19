import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Button, Col, Row, Stack, Container } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login gagal! Periksa kembali email dan password.");
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ overflow: "hidden" }}>
      <Row className="h-100">
        <Col md={8} className="p-0" style={{ overflowY: "hidden" }}>
          <div
            style={{
              backgroundImage: `url('/assets/img/2.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              height: "100vh",
              width: "100%",
            }}
          />
        </Col>
        <Col
          md={4}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
            <div className="text-left mb-3">
              <img
                src={"/assets/img/logo.png"} // Path ke gambar ikon
                alt="Login Icon"
                style={{ width: "200px", height: "75px" }} // Sesuaikan ukuran ikon
              />
            </div>
            <div className="my-4">
              <h2>Login</h2>
              <span style={{ color: "#9AA6B2" }}>
                Welcome to project management application
              </span>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Stack direction="horizontal" gap={3}>
                <Button type="submit" className="btn btn-primary">
                  Login
                </Button>
                <Button href="/register" className="btn btn-secondary">
                  Register
                </Button>
              </Stack>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
