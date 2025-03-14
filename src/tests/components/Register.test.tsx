import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Register from "../../pages/register/Register";
import "@testing-library/jest-dom";
import { AxiosHeaders } from "axios";
import * as userApi from "../../api/userApi";

vi.mock("axios");

describe("Register Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render register form", () => {
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("should display error when fields are missing", async () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(
      await screen.findByText("Username, Email and Password are required!")
    ).toBeInTheDocument();
  });

  it("should call register API with correct data", async () => {
    const registerSpy = vi.spyOn(userApi, "handleRegisterApi");

    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(registerSpy).toHaveBeenCalledWith(
      "testuser",
      "test@example.com",
      "password"
    );
  });

  it("should show success message on successful registration", async () => {
    const registerSpy = vi.spyOn(userApi, "handleRegisterApi");
    registerSpy.mockResolvedValueOnce({
      status: 201,
      statusText: "OK",
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
      data: { message: "Registration successful" },
    });

    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(
      await screen.findByText("Registration successful")
    ).toBeInTheDocument();
  });

  it("should show error message on registration failure", async () => {
    const registerSpy = vi.spyOn(userApi, "handleRegisterApi");
    registerSpy.mockRejectedValueOnce({
      response: { data: { message: "Registration failed" } },
    });

    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(
      await screen.findByText("An error occurred. Please try again later.")
    ).toBeInTheDocument();
  });
});
