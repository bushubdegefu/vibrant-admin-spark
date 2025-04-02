
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
  },

  // Get available permissions for a user
  getAvailablePermissionsForUser: (userId) => {
    return api.get(`/blue_auth/permissioncomplementuser/${userId}`);
  },
  
  // Get permissions for a user already have
  getAttachedPermissionsForUser: (userId) => {
    return api.get(`/blue_auth/permissionnoncomplementuser/${userId}`);
  },

  // Get assigned permissions for a user
  getAssignedPermissionsForUser: (userId, page = 1, size = 100) => {
    return api.get(`/blue_auth/permissionuser/${userId}`, { page, size });
  },

  // Add a permission to a user
  addPermissionToUser: (userId, permissionId) => {
    return api.post(`/blue_auth/userpermission/${userId}/${permissionId}`);
  },

  // Remove a permission from a user
  removePermissionFromUser: (userId, permissionId) => {
    return api.delete(`/blue_auth/userpermission/${userId}/${permissionId}`);
  },
  
  // Get available permissions for a group
  getAvailablePermissionsForGroup: (groupId) => {
    return api.get(`/blue_auth/permissioncomplementgroup/${groupId}`);
  },
  
  // Get assigned permissions for a group
  getAssignedPermissionsForGroup: (groupId, page = 1, size = 100) => {
    return api.get(`/blue_auth/permissiongroup/${groupId}`, { page, size });
  },
  
  // Add a permission to a group
  addPermissionToGroup: (groupId, permissionId) => {
    return api.post(`/blue_auth/grouppermission/${groupId}/${permissionId}`);
  },
  
  // Remove a permission from a group
  removePermissionFromGroup: (groupId, permissionId) => {
    return api.delete(`/blue_auth/grouppermission/${groupId}/${permissionId}`);
  }
};
