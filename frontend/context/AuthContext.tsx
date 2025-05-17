/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthContextType,
  User,
  LoginFormData,
  RegisterFormData,
} from "@/types";
import * as authApi from "@/lib/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await authApi.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
      });
      router.push("/dashboard");
      toast.success("Registration successful!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
      });
      router.push("/dashboard");
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
