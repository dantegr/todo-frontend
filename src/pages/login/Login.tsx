import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Card,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext";
import Cookies from "js-cookie";
import { handleLoginApi } from "../../api/userApi";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { accessToken, login } = useAuth();

  useEffect(() => {
    const userId = Cookies.get("userId");
    const accessToken = Cookies.get("accessToken");
    if (userId && accessToken) {
      login(userId, accessToken);
    }
  }, [login]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and Password are required!");
      return;
    }

    try {
      const loginResponse = await handleLoginApi(username, password);
      login(loginResponse.userId, loginResponse.accessToken);
    } catch (e) {
      if (typeof e === "string") {
        setError(e);
      } else if (e instanceof AxiosError) {
        setError(e.response?.data?.error); // works, `e` narrowed to Error
      }
    }
  };

  useEffect(() => {
    if (accessToken !== null) {
      navigate("/");
    }
  }, [accessToken, navigate]);

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
