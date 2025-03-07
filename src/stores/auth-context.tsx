import React, { createContext, useState, ReactNode } from "react";

// Define the context type
interface AuthContextType {
  userId: string;
  accessToken: string;
  setUserId: (name: string) => void;
  setAccessToken: (name: string) => void;
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props Type
interface AuthProviderProps {
  children: ReactNode;
}

// Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{ userId, accessToken, setUserId, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
