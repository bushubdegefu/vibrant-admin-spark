
import { api } from "./client";

export const statsService = {
  // Get statistics data
  getStats: () => {
    return api.get("/blue_auth/stat");
  }
};
