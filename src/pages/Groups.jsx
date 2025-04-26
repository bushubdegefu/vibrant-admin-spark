
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Filter
} from 'lucide-react';
import { toast } from "sonner";
import { groupService } from '@/api';
import AddGroupPopover from '@/components/AddGroupPopover';
import { useForm } from "react-hook-form";

const Groups = () => {
  // Filter states
  const [filters, setFilters] = useState({
    name: '',
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Create form for filters
  const filterForm = useForm({
    defaultValues: {
      name: '',
    }
  });
  
  // Fetch groups data with React Query including filters
  const { 
    data: groupsResponse, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['groups', page, pageSize, filters],
    queryFn: () => groupService.getGroups({
      page,
      size: pageSize,
      ...filters
    }),
    refetchOnWindowFocus: false,
  });

  // Delete group mutation
  const deleteMutation = useMutation({
    mutationFn: (groupId) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete group: " + (error?.message || "Unknown error"));
      console.error(error);
    }
  });

  // Apply filters from form
  const applyFilters = (data) => {
    setFilters(data);
    setPage(1); // Reset to first page when applying new filters
  };

  // Clear all filters
  const clearFilters = () => {
    filterForm.reset({
      name: '',
    });
    setFilters({
      name: '',
    });
    setPage(1);
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleEditGroup = (group) => {
    navigate(`/admin/groups/${group.id}`);
  };

  const handleViewGroupDetails = (group) => {
    navigate(`/admin/groups/${group.id}`);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupToDelete) {
      deleteMutation.mutate(groupToDelete.id);
    }
  };

  // Generate an array of page numbers for pagination
  const generatePagination = () => {
    if (!groupsResponse?.pages) return [];
    
    const totalPages = groupsResponse.pages;
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

  // If there was an error fetching groups
  if (isError) {
    toast.error("Failed to load groups: " + (error?.message || "Unknown error"));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <AddGroupPopover onSuccess={refetch} />
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
            Filter groups by name
          </CardDescription>
        </CardHeader>
        
        {isFiltersVisible && (
          <CardContent>
            <Form {...filterForm}>
              <form onSubmit={filterForm.handleSubmit(applyFilters)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={filterForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-1">
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Filter by group name" {...field} />
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
            <CardTitle>All Groups</CardTitle>
            <CardDescription>Manage permission groups and member access</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span>Loading groups...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupsResponse?.data?.length > 0 ? (
                    groupsResponse.data.map((group) => (
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
                          {group.created_at ? new Date(group.created_at).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {group.updated_at ? new Date(group.updated_at).toLocaleDateString() : "-"}
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
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {groupsResponse?.total ? (
                <>Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, groupsResponse.total)}</strong> of <strong>{groupsResponse.total}</strong> groups</>
              ) : (
                'No groups found'
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
          
          {groupsResponse?.pages > 1 && (
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
                    onClick={() => setPage(p => p < (groupsResponse?.pages || 1) ? p + 1 : p)}
                    className={page >= (groupsResponse?.pages || 1) ? "pointer-events-none opacity-50" : ""}
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
              Are you sure you want to delete the "{groupToDelete?.name}" group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
