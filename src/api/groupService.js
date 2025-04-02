
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

  // Get users in a group
  getGroupUsers: (groupId, page = 1, size = 10) => {
    return api.get(`/blue_auth/usergroup/${groupId}`, { page, size });
  },

  // Get users that can be added to a group
  getAvailableUsersForGroup: (groupId) => {
    return api.get(`/blue_auth/usercomplementgroup/${groupId}`);
  },

  // Add a user to a group
  addUserToGroup: (groupId, userId) => {
    return api.post(`/blue_auth/groupuser/${groupId}/${userId}`);
  },

  // Remove a user from a group
  removeUserFromGroup: (groupId, userId) => {
    return api.delete(`/blue_auth/groupuser/${groupId}/${userId}`);
  },

  // Get permissions assigned to a group
  getGroupPermissions: (groupId, page = 1, size = 10) => {
    return api.get(`/blue_auth/permissiongroup/${groupId}`, { page, size });
  },

  // Get permissions that can be assigned to a group
  getAvailablePermissionsForGroup: (groupId) => {
    return api.get(`/blue_auth/permissioncomplementgroup/${groupId}`);
  },
  
  // Get permissions attached to a group
  getAttachedPermissionsForGroup: (groupId) => {
    return api.get(`/blue_auth/permissionnoncomplementgroup/${groupId}`);
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
