
import { api } from "./client";

export const permissionService = {
  // Get a paginated list of permissions
  getPermissions: (page = 1, size = 10) => {
    return api.get("/blue_auth/permission", { page, size });
  },

  // Get a specific permission by ID
  getPermissionById: (permissionId) => {
    return api.get(`/blue_auth/permission/${permissionId}`);
  },

  // Create a new permission
  createPermission: (permissionData) => {
    return api.post("/blue_auth/permission", permissionData);
  },

  // Update a permission
  updatePermission: (permissionId, permissionData) => {
    return api.patch(`/blue_auth/permission/${permissionId}`, permissionData);
  },

  // Delete a permission
  deletePermission: (permissionId) => {
    return api.delete(`/blue_auth/permission/${permissionId}`);
  },

  // Get users with a specific permission
  getUsersWithPermission: (permissionId, page = 1, size = 10) => {
    return api.get(`/blue_auth/userpermission/${permissionId}`, { page, size });
  },

  // Get groups with a specific permission
  getGroupsWithPermission: (permissionId, page = 1, size = 10) => {
    return api.get(`/blue_auth/grouppermission/${permissionId}`, { page, size });
  }
};
