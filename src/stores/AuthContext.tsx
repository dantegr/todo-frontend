import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the shape of the authentication state
interface AuthState {
  userId: string | null;
  accessToken: string | null;
}

// Define actions for the reducer
type AuthAction =
  | { type: "LOGIN"; payload: { userId: string; accessToken: string } }
  | { type: "LOGOUT" };

// Initial authentication state
const initialState: AuthState = {
  userId: null,
  accessToken: null,
};

// Reducer function to handle authentication actions
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        userId: action.payload.userId,
        accessToken: action.payload.accessToken,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

// Create authentication context
interface AuthContextType extends AuthState {
  login: (userId: string, accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around the app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userId: string, accessToken: string) => {
    dispatch({ type: "LOGIN", payload: { userId, accessToken } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
