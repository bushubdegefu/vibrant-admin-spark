
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Save,
  Check,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";

// Mock user data
const mockUserData = {
  id: 1,
  username: 'admin',
  firstName: '',
  lastName: '',
  email: 'admin@example.com',
  isActive: true,
  isStaff: true,
  isSuperuser: true,
  lastLogin: '2023-05-27T14:48:21',
  dateJoined: '2023-05-16T12:44:55',
  availableGroups: ['super_user'],
  chosenGroups: [],
  availablePermissions: [
    { id: 1, name: 'Can add log entry', category: 'Administration' },
    { id: 2, name: 'Can change log entry', category: 'Administration' },
    { id: 3, name: 'Can delete log entry', category: 'Administration' },
    { id: 4, name: 'Can view log entry', category: 'Administration' },
    { id: 5, name: 'Can add group', category: 'Authentication and Authorization' },
    { id: 6, name: 'Can change group', category: 'Authentication and Authorization' },
    { id: 7, name: 'Can delete group', category: 'Authentication and Authorization' },
    { id: 8, name: 'Can view group', category: 'Authentication and Authorization' },
    { id: 9, name: 'Can add permission', category: 'Authentication and Authorization' },
    { id: 10, name: 'Can change permission', category: 'Authentication and Authorization' },
  ],
  chosenPermissions: []
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(mockUserData);
  const [password, setPassword] = useState({ value: '', confirmed: '' });
  const [searchGroups, setSearchGroups] = useState({ available: '', chosen: '' });
  const [searchPermissions, setSearchPermissions] = useState({ available: '', chosen: '' });

  // Filter functions
  const filteredAvailableGroups = userData.availableGroups.filter(group => 
    group.toLowerCase().includes(searchGroups.available.toLowerCase())
  );
  
  const filteredChosenGroups = userData.chosenGroups.filter(group => 
    group.toLowerCase().includes(searchGroups.chosen.toLowerCase())
  );
  
  const filteredAvailablePermissions = userData.availablePermissions.filter(perm => 
    perm.name.toLowerCase().includes(searchPermissions.available.toLowerCase()) ||
    perm.category.toLowerCase().includes(searchPermissions.available.toLowerCase())
  );
  
  const filteredChosenPermissions = userData.chosenPermissions.filter(perm => 
    perm.name.toLowerCase().includes(searchPermissions.chosen.toLowerCase()) ||
    perm.category.toLowerCase().includes(searchPermissions.chosen.toLowerCase())
  );

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
    setPassword({ ...password, [name]: value });
  };

  const moveGroup = (group, direction) => {
    if (direction === 'to-chosen') {
      setUserData({
        ...userData,
        availableGroups: userData.availableGroups.filter(g => g !== group),
        chosenGroups: [...userData.chosenGroups, group]
      });
    } else {
      setUserData({
        ...userData,
        chosenGroups: userData.chosenGroups.filter(g => g !== group),
        availableGroups: [...userData.availableGroups, group]
      });
    }
  };

  const movePermission = (permission, direction) => {
    if (direction === 'to-chosen') {
      setUserData({
        ...userData,
        availablePermissions: userData.availablePermissions.filter(p => p.id !== permission.id),
        chosenPermissions: [...userData.chosenPermissions, permission]
      });
    } else {
      setUserData({
        ...userData,
        chosenPermissions: userData.chosenPermissions.filter(p => p.id !== permission.id),
        availablePermissions: [...userData.availablePermissions, permission]
      });
    }
  };

  const handleSave = () => {
    toast.success("User details saved successfully");
    navigate('/users');
  };

  const moveAllGroups = (direction) => {
    if (direction === 'to-chosen') {
      setUserData({
        ...userData,
        chosenGroups: [...userData.chosenGroups, ...filteredAvailableGroups],
        availableGroups: userData.availableGroups.filter(g => !filteredAvailableGroups.includes(g))
      });
    } else {
      setUserData({
        ...userData,
        availableGroups: [...userData.availableGroups, ...filteredChosenGroups],
        chosenGroups: userData.chosenGroups.filter(g => !filteredChosenGroups.includes(g))
      });
    }
  };

  const moveAllPermissions = (direction) => {
    if (direction === 'to-chosen') {
      setUserData({
        ...userData,
        chosenPermissions: [...userData.chosenPermissions, ...filteredAvailablePermissions],
        availablePermissions: userData.availablePermissions.filter(p => 
          !filteredAvailablePermissions.some(fp => fp.id === p.id))
      });
    } else {
      setUserData({
        ...userData,
        availablePermissions: [...userData.availablePermissions, ...filteredChosenPermissions],
        chosenPermissions: userData.chosenPermissions.filter(p => 
          !filteredChosenPermissions.some(fp => fp.id === p.id))
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/users')}
          >
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-primary">
              {userData.username}
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
              />
              <p className="text-xs text-muted-foreground">
                Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
              </p>
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password:</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="password"
                  name="value" 
                  type="password"
                  value={password.value}
                  onChange={handlePasswordChange}
                  placeholder="******************"
                  className="font-mono"
                />
                <Button variant="outline" size="sm">
                  Reset Password
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Raw passwords are not stored, so there is no way to see this user's password, but you can change the password using this form.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Personal Info Card */}
        <Card>
          <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
            <CardTitle className="text-base font-medium">Personal info</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name:</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name:</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={userData.lastName}
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Permissions Card */}
        <Card>
          <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
            <CardTitle className="text-base font-medium">Permissions</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive" 
                  checked={userData.isActive}
                  onCheckedChange={() => handleCheckboxChange('isActive')}
                />
                <Label htmlFor="isActive" className="font-normal">Active</Label>
                <p className="text-xs text-muted-foreground ml-2">
                  Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isStaff" 
                  checked={userData.isStaff}
                  onCheckedChange={() => handleCheckboxChange('isStaff')}
                />
                <Label htmlFor="isStaff" className="font-normal">Staff status</Label>
                <p className="text-xs text-muted-foreground ml-2">
                  Designates whether the user can log into this admin site.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isSuperuser" 
                  checked={userData.isSuperuser}
                  onCheckedChange={() => handleCheckboxChange('isSuperuser')}
                />
                <Label htmlFor="isSuperuser" className="font-normal">Superuser status</Label>
                <p className="text-xs text-muted-foreground ml-2">
                  Designates that this user has all permissions without explicitly assigning them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                    onChange={(e) => setSearchGroups({...searchGroups, available: e.target.value})}
                  />
                </div>
                <div className="border rounded-md h-[300px] overflow-y-auto">
                  <ul className="py-1">
                    {filteredAvailableGroups.map((group, index) => (
                      <li 
                        key={index} 
                        className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                        onClick={() => moveGroup(group, 'to-chosen')}
                      >
                        {group}
                      </li>
                    ))}
                    {filteredAvailableGroups.length === 0 && (
                      <li className="px-3 py-2 text-muted-foreground italic text-center">
                        No groups available
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveAllGroups('to-chosen')}
                    disabled={filteredAvailableGroups.length === 0}
                  >
                    Choose all
                  </Button>
                </div>
              </div>
              
              {/* Chosen Groups */}
              <div className="space-y-2">
                <div className="font-medium pb-1">Chosen groups</div>
                <div className="relative">
                  <Input 
                    placeholder="Filter..." 
                    value={searchGroups.chosen}
                    onChange={(e) => setSearchGroups({...searchGroups, chosen: e.target.value})}
                  />
                </div>
                <div className="border rounded-md h-[300px] overflow-y-auto">
                  <ul className="py-1">
                    {filteredChosenGroups.map((group, index) => (
                      <li 
                        key={index} 
                        className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                        onClick={() => moveGroup(group, 'to-available')}
                      >
                        {group}
                      </li>
                    ))}
                    {filteredChosenGroups.length === 0 && (
                      <li className="px-3 py-2 text-muted-foreground italic text-center">
                        No groups selected
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveAllGroups('to-available')}
                    disabled={filteredChosenGroups.length === 0}
                  >
                    Remove all
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              The groups this user belongs to. A user will get all permissions granted to each of their groups.
            </p>
          </CardContent>
        </Card>
        
        {/* User Permissions Card */}
        <Card>
          <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
            <CardTitle className="text-base font-medium">User permissions</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Available Permissions */}
              <div className="space-y-2">
                <div className="font-medium pb-1">Available user permissions</div>
                <div className="relative">
                  <Input 
                    placeholder="Filter..." 
                    value={searchPermissions.available}
                    onChange={(e) => setSearchPermissions({...searchPermissions, available: e.target.value})}
                  />
                </div>
                <div className="border rounded-md h-[300px] overflow-y-auto">
                  <ul className="py-1">
                    {filteredAvailablePermissions.map((permission) => (
                      <li 
                        key={permission.id} 
                        className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                        onClick={() => movePermission(permission, 'to-chosen')}
                      >
                        <div>
                          <div className="text-xs text-muted-foreground">{permission.category}</div>
                          <div>{permission.name}</div>
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
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveAllPermissions('to-chosen')}
                    disabled={filteredAvailablePermissions.length === 0}
                  >
                    Choose all
                  </Button>
                </div>
              </div>
              
              {/* Chosen Permissions */}
              <div className="space-y-2">
                <div className="font-medium pb-1">Chosen user permissions</div>
                <div className="relative">
                  <Input 
                    placeholder="Filter..." 
                    value={searchPermissions.chosen}
                    onChange={(e) => setSearchPermissions({...searchPermissions, chosen: e.target.value})}
                  />
                </div>
                <div className="border rounded-md h-[300px] overflow-y-auto">
                  <ul className="py-1">
                    {filteredChosenPermissions.map((permission) => (
                      <li 
                        key={permission.id} 
                        className="px-3 py-2 hover:bg-muted flex justify-between items-center cursor-pointer"
                        onClick={() => movePermission(permission, 'to-available')}
                      >
                        <div>
                          <div className="text-xs text-muted-foreground">{permission.category}</div>
                          <div>{permission.name}</div>
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
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveAllPermissions('to-available')}
                    disabled={filteredChosenPermissions.length === 0}
                  >
                    Remove all
                  </Button>
                </div>
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
            <CardTitle className="text-base font-medium">Important dates</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                  <Label className="text-sm font-normal">Last login:</Label>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">{new Date(userData.lastLogin).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Time: {new Date(userData.lastLogin).toLocaleTimeString()}</div>
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
                    <div className="text-sm">{new Date(userData.dateJoined).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Time: {new Date(userData.dateJoined).toLocaleTimeString()}</div>
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
        <Button variant="outline" onClick={() => navigate('/users')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => toast.success("User details saved successfully")}>
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
