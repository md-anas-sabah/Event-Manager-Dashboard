import apiClient from "@/lib/apiClient";
import { User, LoginFormData, RegisterFormData } from "@/types";

export const register = async (userData: RegisterFormData) => {
  try {
    console.log(
      "Sending register request to:",
      apiClient.defaults.baseURL + "/auth/register"
    );
    console.log("With data:", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const response = await apiClient.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const login = async (credentials: LoginFormData) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);

    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
