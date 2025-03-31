
import { api } from "./client";

export const userService = {
  // Get a paginated list of users
  getUsers: (page = 1, size = 10) => {
    return api.get("/blue_auth/user", { page, size });
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
  updateUser: (userId, userData) => {
    return api.patch(`/blue_auth/user/${userId}`, userData);
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
  addPermissionToUser: (userId, permissionId) => {
    return api.post(`/blue_auth/userpermission/${userId}/${permissionId}`);
  },

  // Remove a permission from a user
  removePermissionFromUser: (userId, permissionId) => {
    return api.delete(`/blue_auth/userpermission/${userId}/${permissionId}`);
  },

  // Get user's groups
  getUserGroups: (userId, page = 1, size = 10) => {
    return api.get(`/blue_auth/groupuser/${userId}`, { page, size });
  },

  // Get groups that can be assigned to a user
  getAvailableGroupsForUser: (userId) => {
    return api.get(`/blue_auth/groupcomplementuser/${userId}`);
  },

  // Add a user to a group
  addUserToGroup: (userId, groupId) => {
    return api.post(`/blue_auth/groupuser/${groupId}/${userId}`);
  },

  // Remove a user from a group
  removeUserFromGroup: (userId, groupId) => {
    return api.delete(`/blue_auth/groupuser/${groupId}/${userId}`);
  }
};
