
import { api } from "./client";

export const groupService = {
  // Get a paginated list of groups
  getGroups: (page = 1, size = 10) => {
    return api.get("/blue_auth/group", { page, size });
  },

  // Get a specific group by ID
  getGroupById: (groupId) => {
    return api.get(`/blue_auth/group/${groupId}`);
  },

  // Create a new group
  createGroup: (groupData) => {
    return api.post("/blue_auth/group", groupData);
  },

  // Update a group
  updateGroup: (groupId, groupData) => {
    return api.patch(`/blue_auth/group/${groupId}`, groupData);
  },

  // Delete a group
  deleteGroup: (groupId) => {
    return api.delete(`/blue_auth/group/${groupId}`);
  },

  // Get permissions assigned to a group
  getGroupPermissions: (permissionId, page = 1, size = 10) => {
    return api.get(`/blue_auth/grouppermission/${permissionId}`, { page, size });
  },

  // Get permissions that can be assigned to a group
  getAvailablePermissionsForGroup: (groupId) => {
    return api.get(`/blue_auth/groupcomplementpermission/${groupId}`);
  },

  // Add a permission to a group
  addPermissionToGroup: (groupId, permissionId) => {
    return api.post(`/blue_auth/grouppermission/${groupId}/${permissionId}`);
  },

  // Remove a permission from a group
  removePermissionFromGroup: (groupId, permissionId) => {
    return api.delete(`/blue_auth/grouppermission/${groupId}/${permissionId}`);
  },

  // Get users in a group
  getGroupUsers: (groupId, page = 1, size = 10) => {
    return api.get(`/blue_auth/usergroup/${groupId}`, { page, size });
  }
};
