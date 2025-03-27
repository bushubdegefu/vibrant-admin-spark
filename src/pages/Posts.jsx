
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye,
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { toast } from "sonner";

// Mock posts data
const postsData = [
  { 
    id: 1, 
    title: 'Getting Started with Django',
    excerpt: 'Learn the basics of Django framework and how to build your first app.',
    author: 'John Smith',
    category: 'Tutorial',
    status: 'Published',
    date: '2023-06-15',
    comments: 24,
    views: 1250,
  },
  { 
    id: 2, 
    title: 'Advanced Django Admin Customization',
    excerpt: 'Take your Django admin to the next level with these advanced customization techniques.',
    author: 'Emma Johnson',
    category: 'Tutorial',
    status: 'Published',
    date: '2023-07-22',
    comments: 18,
    views: 986,
  },
  { 
    id: 3, 
    title: 'Django REST Framework Best Practices',
    excerpt: 'Learn the best practices for building APIs with Django REST Framework.',
    author: 'Michael Brown',
    category: 'Guide',
    status: 'Draft',
    date: '2023-08-05',
    comments: 0,
    views: 0,
  },
  { 
    id: 4, 
    title: 'Deploying Django Applications to Production',
    excerpt: 'A comprehensive guide to deploying Django applications to production environments.',
    author: 'Sarah Davis',
    category: 'Guide',
    status: 'Published',
    date: '2023-08-12',
    comments: 32,
    views: 2100,
  },
  { 
    id: 5, 
    title: 'Django Security Checklist',
    excerpt: 'Essential security checks for your Django applications before going live.',
    author: 'David Wilson',
    category: 'Security',
    status: 'Published',
    date: '2023-09-01',
    comments: 15,
    views: 1420,
  },
  { 
    id: 6, 
    title: 'Building Real-time Features with Django Channels',
    excerpt: 'Learn how to implement WebSockets and real-time features in Django using Channels.',
    author: 'Lisa Taylor',
    category: 'Tutorial',
    status: 'Draft',
    date: '2023-09-18',
    comments: 0,
    views: 0,
  },
];

const categories = ['Tutorial', 'Guide', 'Security', 'News', 'Case Study'];

const Posts = () => {
  const [posts, setPosts] = useState(postsData);
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    category: 'Tutorial',
    status: 'Draft',
  });

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchValue.toLowerCase()) ||
    post.author.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setNewPost({
      title: '',
      excerpt: '',
      category: 'Tutorial',
      status: 'Draft',
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      status: post.status,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      toast.success("Post deleted successfully");
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleSubmitPost = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (editingPost) {
      // Edit existing post
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...newPost } 
          : post
      ));
      toast.success("Post updated successfully");
    } else {
      // Add new post
      const id = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
      setPosts([...posts, { 
        id, 
        ...newPost, 
        author: 'Admin User',
        date: currentDate,
        comments: 0,
        views: 0,
      }]);
      toast.success("Post added successfully");
    }
    
    setIsAddEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewPost({ ...newPost, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Button onClick={handleAddPost}>
          <Plus size={16} className="mr-2" />
          Add Post
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>Manage blog posts and articles</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search posts..."
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
                  <TableHead className="min-w-[250px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText size={14} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'Published' ? 'success' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.date}</TableCell>
                      <TableCell>{post.comments}</TableCell>
                      <TableCell>{post.views}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye size={14} className="mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPost(post)}>
                              <Pencil size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(post)}
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
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No posts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <strong>1</strong> to <strong>{filteredPosts.length}</strong> of <strong>{filteredPosts.length}</strong> posts
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
      
      {/* Add/Edit Post Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
            <DialogDescription>
              {editingPost 
                ? 'Update the post details below'
                : 'Fill in the information for the new post'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                name="title"
                value={newPost.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea 
                id="excerpt"
                name="excerpt"
                value={newPost.excerpt}
                onChange={handleInputChange}
                placeholder="Enter post excerpt"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newPost.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newPost.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPost}>
              {editingPost ? 'Save Changes' : 'Add Post'}
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
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
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

export default Posts;
