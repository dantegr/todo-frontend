import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Alert,
  Card,
} from "@mui/material";

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username, Email and Password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        // Redirect to the Home
        setSuccess(response.data.message);
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      // Type assertion for error handling
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Invalid credentials.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card
            variant="outlined"
            sx={{ margin: 0.5, padding: 0.5, borderRadius: "8px" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                style={{ maxHeight: "3rem", marginRight: "10px" }}
                src="/src/assets/todo.svg"
              />
              <Typography variant="h4"> To Do App</Typography>
            </Box>
          </Card>
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="User name"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
