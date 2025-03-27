
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { toast } from "sonner";

// Mock groups data
const groupsData = [
  { 
    id: 1, 
    name: 'Administrators', 
    userCount: 3,
    permissions: 24,
  },
  { 
    id: 2, 
    name: 'Editors', 
    userCount: 8,
    permissions: 16,
  },
  { 
    id: 3, 
    name: 'Viewers', 
    userCount: 15,
    permissions: 8,
  },
  { 
    id: 4, 
    name: 'Content Managers', 
    userCount: 5,
    permissions: 12,
  },
  { 
    id: 5, 
    name: 'Support Team', 
    userCount: 7,
    permissions: 10,
  },
];

const Groups = () => {
  const [groups, setGroups] = useState(groupsData);
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const navigate = useNavigate();
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const handleAddGroup = () => {
    navigate('/groups/new');
  };

  const handleEditGroup = (group) => {
    navigate(`/groups/${group.id}`);
  };

  const handleViewGroupDetails = (group) => {
    navigate(`/groups/${group.id}`);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupToDelete) {
      setGroups(groups.filter(group => group.id !== groupToDelete.id));
      toast.success("Group deleted successfully");
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
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
              <CardDescription>Manage permission groups and member access</CardDescription>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users size={14} className="text-primary" />
                          </div>
                          <button 
                            className="font-medium hover:underline flex items-center"
                            onClick={() => handleViewGroupDetails(group)}
                          >
                            {group.name}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {group.userCount} {group.userCount === 1 ? 'user' : 'users'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {group.permissions} {group.permissions === 1 ? 'permission' : 'permissions'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewGroupDetails(group)}>
                              <ExternalLink size={14} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{groupToDelete?.name}" group? This action cannot be undone.
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
