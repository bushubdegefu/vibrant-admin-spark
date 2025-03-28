
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:7500/api/v1";

// Default headers for all requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Add auth token if available
const getAuthHeaders = () => {
  const token = localStorage.getItem("app-token");
  return token ? { "X-APP-TOKEN": token } : {};
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...defaultHeaders,
      ...getAuthHeaders(),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || "An error occurred");
    }

    return data;
  } catch (error) {
    toast.error(error.message || "Failed to connect to the server");
    throw error;
  }
};

export const api = {
  get: (endpoint, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return apiRequest(url, { method: "GET" });
  },
  
  post: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  patch: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  
  delete: (endpoint) => {
    return apiRequest(endpoint, { method: "DELETE" });
  },
};
