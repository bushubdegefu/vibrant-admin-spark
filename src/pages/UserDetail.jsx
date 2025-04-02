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
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService, userService } from "@/api";

// Mock user data
const mockUserData = {
  id: 1,
  username: "admin",
  firstName: "",
  lastName: "",
  email: "admin@example.com",
  isActive: true,
  isStaff: true,
  isSuperuser: true,
  lastLogin: "2023-05-27T14:48:21",
  dateJoined: "2023-05-16T12:44:55",
  availableGroups: ["super_user"],
  chosenGroups: [],
  availablePermissions: [
    { id: 1, name: "Can add log entry", category: "Administration" },
    { id: 2, name: "Can change log entry", category: "Administration" },
    { id: 3, name: "Can delete log entry", category: "Administration" },
    { id: 4, name: "Can view log entry", category: "Administration" },
    {
      id: 5,
      name: "Can add group",
      category: "Authentication and Authorization",
    },
    {
      id: 6,
      name: "Can change group",
      category: "Authentication and Authorization",
    },
    {
      id: 7,
      name: "Can delete group",
      category: "Authentication and Authorization",
    },
    {
      id: 8,
      name: "Can view group",
      category: "Authentication and Authorization",
    },
    {
      id: 9,
      name: "Can add permission",
      category: "Authentication and Authorization",
    },
    {
      id: 10,
      name: "Can change permission",
      category: "Authentication and Authorization",
    },
  ],
  chosenPermissions: [],
};

const UserDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
      "email": "",
      "first_name": "",
      "last_name": "",
      "is_active": false,
      "is_staff": false,
      "is_superuser": false,
      "password": "default@123",
      "username": ""
    });
  const [searchGroups, setSearchGroups] = useState({
    available: "",
    chosen: "",
  });
  const [searchPermissions, setSearchPermissions] = useState({
    available: "",
    chosen: "",
  });

    // Custom sleep function
   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  // ######################################################################D
  // React Mutations
  const { mutate: addUserToGroup } = useMutation({
    mutationFn: userService.addUserToGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user_comp_groups", id] });
      queryClient.invalidateQueries({ queryKey: ["user_attached_groups", id] });
      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const { mutate: removeUserFromGroup } = useMutation({
    mutationFn: userService.removeUserFromGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user_comp_groups", id] });
      queryClient.invalidateQueries({ queryKey: ["user_attached_groups", id] });

      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
  const { mutate: addPermissionToUser } = useMutation({
    mutationFn: userService.addPermissionToUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user_permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["user_comp_permissions", id] });
      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const { mutate: removePermissionFromUser } = useMutation({
    mutationFn: userService.removePermissionFromUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user_permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["user_comp_permissions", id] });

      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

const { mutate: saveUpdate } = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user_single", id] });
     

      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  // ######################################################################D
  // Fetch users data with React Query
  // Filter functions
  const { data: singleUser } = useQuery({
    queryKey: ["user_single", id],
    queryFn: () => userService.getUserById(id),
    
  });

  // Fetch users data with React Query
  const { data: userComplementPermissions } = useQuery({
    queryKey: ["user_comp_permissions", id],
    queryFn: () => permissionService.getAvailablePermissionsForUser(id),
  });

  const { data: userPermissions } = useQuery({
    queryKey: ["user_permissions", id],
    queryFn: () => permissionService.getAttachedPermissionsForUser(id),
  });

  const { data: userComplementGroups } = useQuery({
    queryKey: ["user_comp_groups", id],
    queryFn: () => userService.getAvailableGroupsForUser(id),
  });

  const { data: userGroups } = useQuery({
    queryKey: ["user_attached_groups", id],
    queryFn: () => userService.getAttachedGroupsForUser(id),
  });

  //  below are filtered data from react qeury functions
  const filteredAvailableGroups =
    userComplementGroups?.data.filter((group) =>
      group.name.toLowerCase().includes(searchGroups.available.toLowerCase())
    ) || [];

  const filteredChosenGroups =
    userGroups?.data.filter((group) =>
      group.name.toLowerCase().includes(searchGroups.chosen.toLowerCase())
    ) || [];

  const filteredAvailablePermissions =
    userComplementPermissions?.data.filter((perm) =>
      perm.codename
        .toLowerCase()
        .includes(searchPermissions.available.toLowerCase())
    ) || [];

  const filteredChosenPermissions =
    userPermissions?.data.filter((perm) =>
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const moveGroup = (groupId, direction) => {
    const userId = id; 
    console.log(groupId);
    if (direction === "add") {
      addUserToGroup( {userId, groupId});
    } else {
      removeUserFromGroup({userId, groupId});
    }
  };

  const movePermission = (permissionId, direction) => {
    const userId = id; 
    if (direction == "add") {
      addPermissionToUser({ userId,permissionId })
    } else {
      removePermissionFromUser({userId, permissionId})
      console.log("coming delete");
    }
  };

  useEffect(()=>{
    setUserData({...userData, 
      "username": singleUser?.data?.username,
      "first_name": singleUser?.data?.first_name,
      "last_name": singleUser?.data?.last_name,
      "email": singleUser?.data?.email,
      "is_active": singleUser?.data?.is_active,
      "is_staff": singleUser?.data?.is_staff,
      "is_superuser": singleUser?.data?.is_superuser,
      "password": "default@123",
    })
    // setUserData({...singleUser?.data})
    console.log(userData);
  },[singleUser])

  const handleSave = () => {
    console.log(userData)
    saveUpdate({userId: id, userData});
    toast.success("User details saved successfully");
    // navigate("/users");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/users")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Change user</h1>
        </div>

        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>

      <div className="grid gap-6">
        {/* User Info Card */}
        <ErrorBoundary>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-primary">
                {singleUser?.data?.username}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username:</Label>
                <Input
                  id="username"
                  name="username"
                  value={userData?.username}
                  onChange={handleInputChange}
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
                    value={userData?.password}
                    onChange={handlePasswordChange}
                    placeholder="******************"
                    className="font-mono"
                  />
                  <Button variant="outline" size="sm">
                    Reset Password
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Raw passwords are not stored, so there is no way to see this
                  user's password, but you can change the password using this
                  form.
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
                    value={userData?.first_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name:</Label>
                  <Input
                    id="lastName"
                    name="last_name"
                    value={userData?.last_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address:</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData?.email}
                    onChange={handleInputChange}
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
                    checked={userData?.is_active}
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
                    checked={userData?.is_staff}
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
                    checked={userData?.is_superuser}
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
                      {new Date(singleUser?.data?.last_login).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time:{" "}
                      {new Date(
                        singleUser?.data?.last_login
                      ).toLocaleTimeString()}
                    </div>
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
                      {new Date(singleUser?.data?.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time:{" "}
                      {new Date(
                        singleUser?.data?.created_at
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Note: The date and time is displayed in your local timezone.
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                  <Label className="text-sm font-normal">Last Updated at</Label>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">
                      {new Date(singleUser?.data?.updated_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time:{" "}
                      {new Date(
                        singleUser?.data?.updated_at
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Note: The date and time is displayed in your local timezone.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/users")}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => toast.success("User details saved successfully")}
          >
            Save and continue editing
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
