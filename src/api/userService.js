
import { api } from "./client";

export const userService = {
  // Get a paginated list of users with optional search filters
  getUsers: (params = {}) => {
    // Default page and size if not provided
    const { page = 1, size = 10 } = params;
    return api.get("/blue_auth/user", params);
  },

  // Get a specific user by ID
  getUserById: (userId) => {
    return api.get(`/blue_auth/user/${userId}`);
  },

  // Create a new user
  createUser: (userData) => {
    return api.post("/blue_auth/user", userData);
  },

  // Update a user
  updateUser: (data) => {
    console.log("data", data);
    return api.patch(`/blue_auth/user/${data?.userId}`, data?.userData);
  },

  // Delete a user
  deleteUser: (userId) => {
    return api.delete(`/blue_auth/user/${userId}`);
  },

  // Get user's permissions
  getUserPermissions: (userId, page = 1, size = 10) => {
    return api.get(`/blue_auth/permissionuser/${userId}`, { page, size });
  },

  // Get permissions that can be assigned to a user
  getAvailablePermissionsForUser: (userId) => {
    return api.get(`/blue_auth/permissioncomplementuser/${userId}`);
  },

  // Add a permission to a user
  addPermissionToUser: (data) => {
    return api.post(`/blue_auth/userpermission/${data?.userId}/${data?.permissionId}`);
  },

  // Remove a permission from a user
  removePermissionFromUser: (data) => {
    return api.delete(`/blue_auth/userpermission/${data?.userId}/${data?.permissionId}`);
  },

  // Get user's groups
  getUserGroups: (userId, page = 1, size = 10) => {
    return api.get(`/blue_auth/groupuser/${userId}`, { page, size });
  },

  // Get groups that can be assigned to a user
  getAvailableGroupsForUser: (userId) => {
    return api.get(`/blue_auth/groupcomplementuser/${userId}`);
  },
  
  // Get groups assigned to a user
  getAttachedGroupsForUser: (userId) => {
    return api.get(`/blue_auth/groupnoncomplementuser/${userId}`);
  },

  // Add a user to a group
  addUserToGroup: (data) => {
    return api.post(`/blue_auth/groupuser/${data?.groupId}/${data?.userId}`);
  },

  // Remove a user from a group
  removeUserFromGroup: (data) => {
    return api.delete(`/blue_auth/groupuser/${data?.groupId}/${data?.userId}`);
  }
};
