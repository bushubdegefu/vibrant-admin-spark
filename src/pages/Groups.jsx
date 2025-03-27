
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UsersRound
} from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Mock groups data
const groupsData = [
  { 
    id: 1, 
    name: 'Administrators',
    description: 'Full access to all system functions',
    members: 3,
    permissions: 24,
  },
  { 
    id: 2, 
    name: 'Content Editors',
    description: 'Can manage and publish content',
    members: 5,
    permissions: 12,
  },
  { 
    id: 3, 
    name: 'Moderators',
    description: 'Can moderate comments and user-generated content',
    members: 4,
    permissions: 8,
  },
  { 
    id: 4, 
    name: 'Viewers',
    description: 'Read-only access to content',
    members: 10,
    permissions: 3,
  },
  { 
    id: 5, 
    name: 'Support Staff',
    description: 'Access to support tickets and user management',
    members: 6,
    permissions: 9,
  }
];

// Mock permissions data
const permissionsData = [
  { id: 1, name: 'User | Can add user', app: 'Authentication and Authorization' },
  { id: 2, name: 'User | Can change user', app: 'Authentication and Authorization' },
  { id: 3, name: 'User | Can delete user', app: 'Authentication and Authorization' },
  { id: 4, name: 'User | Can view user', app: 'Authentication and Authorization' },
  { id: 5, name: 'Group | Can add group', app: 'Authentication and Authorization' },
  { id: 6, name: 'Group | Can change group', app: 'Authentication and Authorization' },
  { id: 7, name: 'Group | Can delete group', app: 'Authentication and Authorization' },
  { id: 8, name: 'Group | Can view group', app: 'Authentication and Authorization' },
  { id: 9, name: 'Permission | Can add permission', app: 'Authentication and Authorization' },
  { id: 10, name: 'Permission | Can change permission', app: 'Authentication and Authorization' },
  { id: 11, name: 'Permission | Can delete permission', app: 'Authentication and Authorization' },
  { id: 12, name: 'Permission | Can view permission', app: 'Authentication and Authorization' },
  { id: 13, name: 'Content type | Can add content type', app: 'Content Types' },
  { id: 14, name: 'Content type | Can change content type', app: 'Content Types' },
  { id: 15, name: 'Content type | Can delete content type', app: 'Content Types' },
  { id: 16, name: 'Content type | Can view content type', app: 'Content Types' },
  { id: 17, name: 'Session | Can add session', app: 'Sessions' },
  { id: 18, name: 'Session | Can change session', app: 'Sessions' },
  { id: 19, name: 'Session | Can delete session', app: 'Sessions' },
  { id: 20, name: 'Session | Can view session', app: 'Sessions' },
];

// Mock users for member selection
const usersForSelection = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 2, name: 'Emma Johnson', email: 'emma.johnson@example.com' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: 4, name: 'Sarah Davis', email: 'sarah.davis@example.com' },
  { id: 5, name: 'David Wilson', email: 'david.wilson@example.com' },
  { id: 6, name: 'Lisa Taylor', email: 'lisa.taylor@example.com' },
  { id: 7, name: 'James Anderson', email: 'james.anderson@example.com' },
  { id: 8, name: 'Patricia Thomas', email: 'patricia.thomas@example.com' },
];

const Groups = () => {
  const [groups, setGroups] = useState(groupsData);
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [currentGroupForPermissions, setCurrentGroupForPermissions] = useState(null);
  const [currentGroupForMembers, setCurrentGroupForMembers] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [permissionsFilter, setPermissionsFilter] = useState('');
  const [membersFilter, setMembersFilter] = useState('');
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
  });

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    group.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredPermissions = permissionsData.filter(permission => 
    permission.name.toLowerCase().includes(permissionsFilter.toLowerCase()) ||
    permission.app.toLowerCase().includes(permissionsFilter.toLowerCase())
  );

  const filteredUsers = usersForSelection.filter(user => 
    user.name.toLowerCase().includes(membersFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(membersFilter.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setNewGroup({
      name: '',
      description: '',
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsDeleteDialogOpen(true);
  };

  const handleManagePermissions = (group) => {
    setCurrentGroupForPermissions(group);
    // In a real app, we would fetch the actual permissions for this group
    // For now, we'll simulate some selected permissions
    setSelectedPermissions(permissionsData.slice(0, group.permissions).map(p => p.id));
    setIsPermissionsDialogOpen(true);
  };

  const handleManageMembers = (group) => {
    setCurrentGroupForMembers(group);
    // In a real app, we would fetch the actual members for this group
    // For now, we'll simulate some selected members
    setSelectedMembers(usersForSelection.slice(0, group.members).map(u => u.id));
    setIsMembersDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupToDelete) {
      setGroups(groups.filter(group => group.id !== groupToDelete.id));
      toast.success("Group deleted successfully");
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleSubmitGroup = () => {
    if (editingGroup) {
      // Edit existing group
      setGroups(groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, ...newGroup } 
          : group
      ));
      toast.success("Group updated successfully");
    } else {
      // Add new group
      const id = groups.length > 0 ? Math.max(...groups.map(group => group.id)) + 1 : 1;
      setGroups([...groups, { 
        id, 
        ...newGroup, 
        members: 0,
        permissions: 0
      }]);
      toast.success("Group added successfully");
    }
    
    setIsAddEditDialogOpen(false);
  };

  const handleSubmitPermissions = () => {
    if (currentGroupForPermissions) {
      // Update group with new permission count
      setGroups(groups.map(group => 
        group.id === currentGroupForPermissions.id 
          ? { ...group, permissions: selectedPermissions.length } 
          : group
      ));
      toast.success("Permissions updated successfully");
      setIsPermissionsDialogOpen(false);
    }
  };

  const handleSubmitMembers = () => {
    if (currentGroupForMembers) {
      // Update group with new member count
      setGroups(groups.map(group => 
        group.id === currentGroupForMembers.id 
          ? { ...group, members: selectedMembers.length } 
          : group
      ));
      toast.success("Members updated successfully");
      setIsMembersDialogOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <Button onClick={handleAddGroup}>
          <Plus size={16} className="mr-2" />
          Add Group
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Groups</CardTitle>
              <CardDescription>Manage user groups and permissions</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search groups..."
                className="pl-9 w-full"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {searchValue && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <ShieldCheck size={14} className="text-primary" />
                          </div>
                          <span className="font-medium">{group.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{group.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {group.members} {group.members === 1 ? 'user' : 'users'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {group.permissions} {group.permissions === 1 ? 'permission' : 'permissions'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleManagePermissions(group)}
                            title="Manage Permissions"
                          >
                            <ShieldCheck size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleManageMembers(group)}
                            title="Manage Members"
                          >
                            <UsersRound size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                                <Pencil size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(group)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No groups found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <strong>1</strong> to <strong>{filteredGroups.length}</strong> of <strong>{filteredGroups.length}</strong> groups
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Group Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? 'Update the group details below'
                : 'Fill in the information for the new group'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input 
                id="name"
                name="name"
                value={newGroup.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                name="description"
                value={newGroup.description}
                onChange={handleInputChange}
                placeholder="Enter group description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitGroup}>
              {editingGroup ? 'Save Changes' : 'Add Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog 
        open={isPermissionsDialogOpen} 
        onOpenChange={setIsPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              {currentGroupForPermissions && `Select permissions for "${currentGroupForPermissions.name}" group`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Filter permissions..."
                className="pl-9 w-full"
                value={permissionsFilter}
                onChange={(e) => setPermissionsFilter(e.target.value)}
              />
              {permissionsFilter && (
                <button 
                  onClick={() => setPermissionsFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((permission) => (
                  <div 
                    key={permission.id} 
                    className="flex items-center space-x-3 p-3 border-b last:border-0 hover:bg-muted/30"
                  >
                    <Checkbox 
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.app}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No permissions found matching your filter
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Selected {selectedPermissions.length} of {permissionsData.length} permissions
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog 
        open={isMembersDialogOpen} 
        onOpenChange={setIsMembersDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Group Members</DialogTitle>
            <DialogDescription>
              {currentGroupForMembers && `Select users for "${currentGroupForMembers.name}" group`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Filter users..."
                className="pl-9 w-full"
                value={membersFilter}
                onChange={(e) => setMembersFilter(e.target.value)}
              />
              {membersFilter && (
                <button 
                  onClick={() => setMembersFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center space-x-3 p-3 border-b last:border-0 hover:bg-muted/30"
                  >
                    <Checkbox 
                      id={`user-${user.id}`}
                      checked={selectedMembers.includes(user.id)}
                      onCheckedChange={() => toggleMember(user.id)}
                    />
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {user.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No users found matching your filter
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Selected {selectedMembers.length} of {usersForSelection.length} users
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMembersDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitMembers}>
              Save Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{groupToDelete?.name}" group? This action cannot be undone and may affect users assigned to this group.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
