
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { userService } from '@/api';

const Users = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  
  // Fetch users data with React Query
  const { 
    data: usersResponse, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => userService.getUsers(page, pageSize)
  });

  // Filtered users based on search
  const filteredUsers = usersResponse?.data 
    ? usersResponse.data.filter(user => 
        user.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleViewUserDetails = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        toast.success("User deleted successfully");
        refetch(); // Refresh the user list
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      } finally {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // If there was an error fetching users
  if (isError) {
    toast.error("Failed to load users: " + (error?.message || "Unknown error"));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button onClick={handleAddUser}>
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search users..."
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-medium text-primary">
                                {user.username?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <button 
                              className="font-medium hover:underline flex items-center"
                              onClick={() => handleViewUserDetails(user)}
                            >
                              {user.username}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                            : '-'}
                        </TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'success' : 'destructive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_staff ? 'default' : 'secondary'}>
                            {user.is_staff ? 'Staff' : 'Regular'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString() 
                            : 'Never'}
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
                              <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                                <ExternalLink size={14} className="mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Pencil size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(user)}
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
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchValue ? 'No matching users found' : 'No users found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {usersResponse?.total ? (
                <>Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, usersResponse.total)}</strong> of <strong>{usersResponse.total}</strong> users</>
              ) : (
                'No users found'
              )}
            </p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={page === 1 ? "bg-primary text-primary-foreground" : ""}
              >
                {page}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                disabled={!usersResponse?.pages || page >= usersResponse.pages || isLoading}
                onClick={() => setPage(p => p + 1)}
              >
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
              Are you sure you want to delete {userToDelete?.username}? This action cannot be undone.
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

export default Users;
