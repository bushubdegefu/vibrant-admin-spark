
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import ErrorBoundary from "../components/ErrorBoundary";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService, userService } from "@/api";

const UserDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isNewUser = id === 'new';
  
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    password: isNewUser ? "" : "default@123",
    username: ""
  });
  
  const [searchGroups, setSearchGroups] = useState({
    available: "",
    chosen: "",
  });
  
  const [searchPermissions, setSearchPermissions] = useState({
    available: "",
    chosen: "",
  });

  // React Mutations
  const { mutate: addUserToGroup, isPending: isAddingToGroup } = useMutation({
    mutationFn: userService.addUserToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_comp_groups", id] });
      queryClient.invalidateQueries({ queryKey: ["user_attached_groups", id] });
    },
    onError: (error) => {
      toast.error(`Error adding user to group: ${error.message || 'Unknown error'}`);
    },
  });

  const { mutate: removeUserFromGroup, isPending: isRemovingFromGroup } = useMutation({
    mutationFn: userService.removeUserFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_comp_groups", id] });
      queryClient.invalidateQueries({ queryKey: ["user_attached_groups", id] });
    },
    onError: (error) => {
      toast.error(`Error removing user from group: ${error.message || 'Unknown error'}`);
    },
  });
  
  const { mutate: addPermissionToUser, isPending: isAddingPermission } = useMutation({
    mutationFn: userService.addPermissionToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["user_comp_permissions", id] });
    },
    onError: (error) => {
      toast.error(`Error adding permission to user: ${error.message || 'Unknown error'}`);
    },
  });

  const { mutate: removePermissionFromUser, isPending: isRemovingPermission } = useMutation({
    mutationFn: userService.removePermissionFromUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["user_comp_permissions", id] });
    },
    onError: (error) => {
      toast.error(`Error removing permission from user: ${error.message || 'Unknown error'}`);
    },
  });

  // Save/Update user mutation
  const { mutate: saveUser, isPending: isSavingUser } = useMutation({
    mutationFn: (data) => {
      if (isNewUser) {
        return userService.createUser(data);
      } else {
        return userService.updateUser({ userId: id, userData: data });
      }
    },
    onSuccess: (data) => {
      toast.success(`User ${isNewUser ? 'created' : 'updated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      if (isNewUser) {
        navigate('/users');
      } else {
        queryClient.invalidateQueries({ queryKey: ["user_single", id] });
      }
    },
    onError: (error) => {
      toast.error(`Error ${isNewUser ? 'creating' : 'updating'} user: ${error.message || 'Unknown error'}`);
    },
  });

  // Fetch user data with React Query if not a new user
  const { data: singleUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user_single", id],
    queryFn: () => userService.getUserById(id),
    enabled: !isNewUser,
  });

  // Fetch complementary permissions and groups data
  const { data: userComplementPermissions } = useQuery({
    queryKey: ["user_comp_permissions", id],
    queryFn: () => permissionService.getAvailablePermissionsForUser(id),
    enabled: !isNewUser,
  });

  const { data: userPermissions } = useQuery({
    queryKey: ["user_permissions", id],
    queryFn: () => permissionService.getAttachedPermissionsForUser(id),
    enabled: !isNewUser,
  });

  const { data: userComplementGroups } = useQuery({
    queryKey: ["user_comp_groups", id],
    queryFn: () => userService.getAvailableGroupsForUser(id),
    enabled: !isNewUser,
  });

  const { data: userGroups } = useQuery({
    queryKey: ["user_attached_groups", id],
    queryFn: () => userService.getAttachedGroupsForUser(id),
    enabled: !isNewUser,
  });

  // Filtered data from React Query functions
  const filteredAvailableGroups =
    userComplementGroups?.data?.filter((group) =>
      group.name.toLowerCase().includes(searchGroups.available.toLowerCase())
    ) || [];

  const filteredChosenGroups =
    userGroups?.data?.filter((group) =>
      group.name.toLowerCase().includes(searchGroups.chosen.toLowerCase())
    ) || [];

  const filteredAvailablePermissions =
    userComplementPermissions?.data?.filter((perm) =>
      perm.codename
        .toLowerCase()
        .includes(searchPermissions.available.toLowerCase())
    ) || [];

  const filteredChosenPermissions =
    userPermissions?.data?.filter((perm) =>
      perm.codename
        .toLowerCase()
        .includes(searchPermissions.chosen.toLowerCase())
    ) || [];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = (name) => {
    setUserData({ ...userData, [name]: !userData[name] });
  };

  const moveGroup = (groupId, direction) => {
    const userId = id;
    if (direction === "add") {
      addUserToGroup({ userId, groupId });
    } else {
      removeUserFromGroup({ userId, groupId });
    }
  };

  const movePermission = (permissionId, direction) => {
    const userId = id;
    if (direction === "add") {
      addPermissionToUser({ userId, permissionId });
    } else {
      removePermissionFromUser({ userId, permissionId });
    }
  };

  // Load user data when available
  useEffect(() => {
    if (singleUser?.data && !isNewUser) {
      setUserData({
        username: singleUser.data.username || "",
        first_name: singleUser.data.first_name || "",
        last_name: singleUser.data.last_name || "",
        email: singleUser.data.email || "",
        is_active: singleUser.data.is_active || false,
        is_staff: singleUser.data.is_staff || false,
        is_superuser: singleUser.data.is_superuser || false,
        password: "default@123",
      });
    }
  }, [singleUser, isNewUser]);

  const handleSave = () => {
    // Basic validation
    if (!userData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    
    if (isNewUser && !userData.password.trim()) {
      toast.error("Password is required for new users");
      return;
    }
    
    if (!userData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    saveUser(userData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/users")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewUser ? 'Create User' : 'Edit User'}
          </h1>
        </div>

        <Button onClick={handleSave} disabled={isSavingUser}>
          {isSavingUser ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      {isLoadingUser && !isNewUser ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span>Loading user details...</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* User Info Card */}
          <ErrorBoundary>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-primary">
                  {isNewUser ? 'New User' : userData.username}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username:</Label>
                  <Input
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Required. 150 characters or fewer. Letters, digits and
                    @/./+/-/_ only.
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userData.password}
                      onChange={handleInputChange}
                      placeholder={isNewUser ? "Enter password" : "******************"}
                      className="font-mono"
                      required={isNewUser}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isNewUser 
                      ? "Required for new users. Choose a strong password." 
                      : "Raw passwords are not stored, so there is no way to see this user's password, but you can change the password using this form."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
          
          {/* Personal Info Card */}
          <ErrorBoundary>
            <Card>
              <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                <CardTitle className="text-base font-medium">
                  Personal info
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name:</Label>
                    <Input
                      id="firstName"
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name:</Label>
                    <Input
                      id="lastName"
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address:</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
          
          {/* Permissions Card */}
          <ErrorBoundary>
            <Card>
              <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                <CardTitle className="text-base font-medium">
                  Permissions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={userData.is_active}
                      onCheckedChange={() => handleCheckboxChange("is_active")}
                    />
                    <Label htmlFor="isActive" className="font-normal">
                      Active
                    </Label>
                    <p className="text-xs text-muted-foreground ml-2">
                      Designates whether this user should be treated as active.
                      Unselect this instead of deleting accounts.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isStaff"
                      checked={userData.is_staff}
                      onCheckedChange={() => handleCheckboxChange("is_staff")}
                    />
                    <Label htmlFor="isStaff" className="font-normal">
                      Staff status
                    </Label>
                    <p className="text-xs text-muted-foreground ml-2">
                      Designates whether the user can log into this admin site.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSuperuser"
                      checked={userData.is_superuser}
                      onCheckedChange={() => handleCheckboxChange("is_superuser")}
                    />
                    <Label htmlFor="isSuperuser" className="font-normal">
                      Superuser status
                    </Label>
                    <p className="text-xs text-muted-foreground ml-2">
                      Designates that this user has all permissions without
                      explicitly assigning them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
          
          {/* Only show these sections for existing users */}
          {!isNewUser && (
            <>
              {/* Groups Card */}
              <Card>
                <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                  <CardTitle className="text-base font-medium">Groups</CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Available Groups */}
                    <div className="space-y-2">
                      <div className="font-medium pb-1">Available groups</div>
                      <div className="relative">
                        <Input
                          placeholder="Filter..."
                          value={searchGroups.available}
                          onChange={(e) =>
                            setSearchGroups({
                              ...searchGroups,
                              available: e.target.value,
                            })
                          }
                        />
                      </div>
                      <ErrorBoundary>
                        <div className="border rounded-md h-[300px] overflow-y-auto">
                          <ul className="py-1">
                            {filteredAvailableGroups.map((group) => (
                              <li
                                key={`add_group_${group?.id}`}
                                className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                                onClick={() => moveGroup(group?.id, "add")}
                              >
                                {group?.name}
                              </li>
                            ))}
                            {filteredAvailableGroups.length === 0 && (
                              <li className="px-3 py-2 text-muted-foreground italic text-center">
                                No groups available
                              </li>
                            )}
                          </ul>
                        </div>
                      </ErrorBoundary>
                    </div>

                    {/* Chosen Groups */}
                    <div className="space-y-2">
                      <div className="font-medium pb-1">Chosen groups</div>
                      <div className="relative">
                        <Input
                          placeholder="Filter..."
                          value={searchGroups.chosen}
                          onChange={(e) =>
                            setSearchGroups({
                              ...searchGroups,
                              chosen: e.target.value,
                            })
                          }
                        />
                      </div>
                      <ErrorBoundary>
                        <div className="border rounded-md h-[300px] overflow-y-auto">
                          <ul className="py-1">
                            {filteredChosenGroups?.map((group) => (
                              <li
                                key={`remove_group_${group?.id}`}
                                className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                                onClick={() => moveGroup(group?.id, "remove")}
                              >
                                {group?.name}
                              </li>
                            ))}
                            {filteredChosenGroups.length === 0 && (
                              <li className="px-3 py-2 text-muted-foreground italic text-center">
                                No groups selected
                              </li>
                            )}
                          </ul>
                        </div>
                      </ErrorBoundary>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    The groups this user belongs to. A user will get all permissions
                    granted to each of their groups.
                  </p>
                </CardContent>
              </Card>

              {/* User Permissions Card */}
              <Card>
                <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                  <CardTitle className="text-base font-medium">
                    User permissions
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Available Permissions */}
                    <div className="space-y-2">
                      <div className="font-medium pb-1">
                        Available user permissions
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Filter..."
                          value={searchPermissions.available}
                          onChange={(e) =>
                            setSearchPermissions({
                              ...searchPermissions,
                              available: e.target.value,
                            })
                          }
                        />
                      </div>
                      <ErrorBoundary>
                        <div className="border rounded-md h-[300px] overflow-y-auto">
                          <ul className="py-1">
                            {filteredAvailablePermissions?.map((permission) => (
                              <li
                                key={`perm-${permission.id}`}
                                className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                  movePermission(permission?.id, "add")
                                }
                              >
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.codename}
                                  </div>
                                  <div>{permission.codename}</div>
                                </div>
                              </li>
                            ))}
                            {filteredAvailablePermissions.length === 0 && (
                              <li className="px-3 py-2 text-muted-foreground italic text-center">
                                No permissions available
                              </li>
                            )}
                          </ul>
                        </div>
                      </ErrorBoundary>
                    </div>

                    {/* Chosen Permissions */}
                    <div className="space-y-2">
                      <div className="font-medium pb-1">Chosen user permissions</div>
                      <div className="relative">
                        <Input
                          placeholder="Filter..."
                          value={searchPermissions.chosen}
                          onChange={(e) =>
                            setSearchPermissions({
                              ...searchPermissions,
                              chosen: e.target.value,
                            })
                          }
                        />
                      </div>
                      <ErrorBoundary>
                        <div className="border rounded-md h-[300px] overflow-y-auto">
                          <ul className="py-1">
                            {filteredChosenPermissions?.map((permission) => (
                              <li
                                key={`exist-${permission.id}`}
                                className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                  movePermission(permission?.id, "remove")
                                }
                              >
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.codename}
                                  </div>
                                  <div>{permission.codename}</div>
                                </div>
                              </li>
                            ))}
                            {filteredChosenPermissions.length === 0 && (
                              <li className="px-3 py-2 text-muted-foreground italic text-center">
                                No permissions selected
                              </li>
                            )}
                          </ul>
                        </div>
                      </ErrorBoundary>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Specific permissions for this user.
                  </p>
                </CardContent>
              </Card>

              {/* Important Dates Card */}
              <Card>
                <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                  <CardTitle className="text-base font-medium">
                    Important dates
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                        <Label className="text-sm font-normal">Last login:</Label>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">
                            {singleUser?.data?.last_login 
                              ? new Date(singleUser.data.last_login).toLocaleString() 
                              : 'Never'}
                          </div>
                          {singleUser?.data?.last_login && (
                            <div className="text-xs text-muted-foreground">
                              Time: {new Date(singleUser.data.last_login).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Note: The date and time is displayed in your local timezone.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                        <Label className="text-sm font-normal">Date joined:</Label>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">
                            {singleUser?.data?.created_at 
                              ? new Date(singleUser.data.created_at).toLocaleString() 
                              : '-'}
                          </div>
                          {singleUser?.data?.created_at && (
                            <div className="text-xs text-muted-foreground">
                              Time: {new Date(singleUser.data.created_at).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Note: The date and time is displayed in your local timezone.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                        <Label className="text-sm font-normal">Last Updated at:</Label>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">
                            {singleUser?.data?.updated_at 
                              ? new Date(singleUser.data.updated_at).toLocaleString() 
                              : '-'}
                          </div>
                          {singleUser?.data?.updated_at && (
                            <div className="text-xs text-muted-foreground">
                              Time: {new Date(singleUser.data.updated_at).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Note: The date and time is displayed in your local timezone.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/users")}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <Button onClick={handleSave} disabled={isSavingUser}>
          {isSavingUser ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;
