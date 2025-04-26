
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Filter
} from 'lucide-react';
import { toast } from "sonner";
import { userService } from '@/api';
import AddUserPopover from '@/components/AddUserPopover';
import { useForm } from 'react-hook-form';

const Users = () => {
  // Filter states
  const [filters, setFilters] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const queryClient = useQueryClient();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  
  // Create form for filters
  const filterForm = useForm({
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
    }
  });
  
  // API query with filters
  const { 
    data: usersResponse, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['users', page, pageSize, filters],
    queryFn: () => userService.getUsers({
      page,
      size: pageSize,
      ...filters
    })
  });

  // Apply filters from form
  const applyFilters = (data) => {
    setFilters(data);
    
    queryClient.invalidateQueries({ queryKey: ['users'] });
    setPage(1); // Reset to first page when applying new filters
  };

  // Clear all filters
  const clearFilters = () => {
    filterForm.reset({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
    });
    setFilters({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
    });
    setPage(1);
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleViewUserDetails = (user) => {
    navigate(`/admin/users/${user.id}`);
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
        refetch();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      } finally {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  if (isError) {
    toast.error("Failed to load users: " + (error?.message || "Unknown error"));
  }

  // Generate an array of page numbers for pagination
  const generatePagination = () => {
    if (!usersResponse?.pages) return [];
    
    const totalPages = usersResponse.pages;
    const currentPage = page;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <AddUserPopover onSuccess={refetch} />
      </div>
      
      {/* Filter Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleFilters}
              className="h-8 w-8"
            >
              {isFiltersVisible ? <X size={16} /> : <Filter size={16} />}
            </Button>
          </div>
          <CardDescription>
            Filter users by any combination of fields
          </CardDescription>
        </CardHeader>
        
        {isFiltersVisible && (
          <CardContent>
            <Form {...filterForm}>
              <form onSubmit={filterForm.handleSubmit(applyFilters)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={filterForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Filter by username" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={filterForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Filter by email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={filterForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Filter by first name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={filterForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Filter by last name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={clearFilters}
                  >
                    Reset
                  </Button>
                  <Button type="submit">
                    Apply Filters
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
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
                  {usersResponse?.data?.length > 0 ? (
                    usersResponse.data.map((user) => (
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
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {usersResponse?.total ? (
                <>Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, usersResponse.total)}</strong> of <strong>{usersResponse.total}</strong> users</>
              ) : (
                'No users found'
              )}
            </p>
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1); // Reset to first page when changing page size
                }}
              >
                {[5, 10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {usersResponse?.pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {generatePagination().map((pageNum, i) => (
                  pageNum === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => p < (usersResponse?.pages || 1) ? p + 1 : p)}
                    className={page >= (usersResponse?.pages || 1) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
      
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
