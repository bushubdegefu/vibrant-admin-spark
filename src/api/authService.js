
import { api } from "./client";
import { toast } from "sonner";

// For demo purposes, we're mocking login/logout since auth endpoints weren't in the Swagger
export const authService = {
  login: async (username, password) => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate it with localStorage
      if (username && password) {
        // Simulate successful login
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("app-token", "demo-token-value");
        localStorage.setItem("user", JSON.stringify({ username }));
        return { success: true };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("app-token");
    localStorage.removeItem("user");
    return { success: true };
  },

  isAuthenticated: () => {
    return localStorage.getItem("isAuthenticated") === "true";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
