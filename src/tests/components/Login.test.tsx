import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Login from "../../pages/login/Login";
import "@testing-library/jest-dom";
import * as userApi from "../../api/userApi";
import { AuthProvider } from "../../stores/AuthContext";

const mockLogin = vi.fn();

vi.mock("../../stores/AuthContext", () => ({
  useAuth: () => ({
    accessToken: null,
    login: mockLogin,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Login Component", () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render login form", () => {
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should call login function with correct credentials", async () => {
    const loginSpy = vi.spyOn(userApi, "handleLoginApi");
    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(loginSpy).toHaveBeenCalledWith("testuser", "password");
  });

  it("should show error message on login failure", async () => {
    const loginSpy = vi.spyOn(userApi, "handleLoginApi");
    const errorMessage = "Invalid credentials";

    loginSpy.mockRejectedValueOnce(errorMessage);

    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it("should return error message when username or password is missing", async () => {
    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "apassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText("Username and Password are required!")
    ).toBeInTheDocument();
  });
});
