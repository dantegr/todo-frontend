import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  accessToken: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCookieSet, setIsCookieSet] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and Password are required!");
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:3001/login",
        {
          username,
          password,
        }
      );

      const { accessToken } = response.data;

      // Save the token in cookies with a 5-minute expiration
      const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
      Cookies.set("accessToken", accessToken, { expires: inFiveMinutes });
      setIsCookieSet(true);
    } catch (error) {
      // Type assertion for error handling
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Invalid credentials.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (isCookieSet) {
      navigate("/");
    }
  }, [isCookieSet, navigate]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
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
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="User name"
              name="userName"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
