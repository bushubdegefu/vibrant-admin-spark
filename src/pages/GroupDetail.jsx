
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
import { 
  ArrowLeft,
  Save,
  Check,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";

// Mock group data
const mockGroupData = {
  id: 1,
  name: 'Administrators',
  availablePermissions: [
    { id: 1, name: 'Can add log entry', category: 'Administration' },
    { id: 2, name: 'Can change log entry', category: 'Administration' },
    { id: 3, name: 'Can delete log entry', category: 'Administration' },
    { id: 4, name: 'Can view log entry', category: 'Administration' },
  ],
  chosenPermissions: [
    { id: 5, name: 'Can add group', category: 'Authentication and Authorization' },
    { id: 6, name: 'Can change group', category: 'Authentication and Authorization' },
    { id: 7, name: 'Can delete group', category: 'Authentication and Authorization' },
    { id: 8, name: 'Can view group', category: 'Authentication and Authorization' },
    { id: 9, name: 'Can add permission', category: 'Authentication and Authorization' },
    { id: 10, name: 'Can change permission', category: 'Authentication and Authorization' },
  ]
};

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState(mockGroupData);
  const [searchPermissions, setSearchPermissions] = useState({ available: '', chosen: '' });

  // Filter functions
  const filteredAvailablePermissions = groupData.availablePermissions.filter(perm => 
    perm.name.toLowerCase().includes(searchPermissions.available.toLowerCase()) ||
    perm.category.toLowerCase().includes(searchPermissions.available.toLowerCase())
  );
  
  const filteredChosenPermissions = groupData.chosenPermissions.filter(perm => 
    perm.name.toLowerCase().includes(searchPermissions.chosen.toLowerCase()) ||
    perm.category.toLowerCase().includes(searchPermissions.chosen.toLowerCase())
  );

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const movePermission = (permission, direction) => {
    if (direction === 'to-chosen') {
      setGroupData({
        ...groupData,
        availablePermissions: groupData.availablePermissions.filter(p => p.id !== permission.id),
        chosenPermissions: [...groupData.chosenPermissions, permission]
      });
    } else {
      setGroupData({
        ...groupData,
        chosenPermissions: groupData.chosenPermissions.filter(p => p.id !== permission.id),
        availablePermissions: [...groupData.availablePermissions, permission]
      });
    }
  };

  const handleSave = () => {
    toast.success("Group details saved successfully");
    navigate('/groups');
  };

  const moveAllPermissions = (direction) => {
    if (direction === 'to-chosen') {
      setGroupData({
        ...groupData,
        chosenPermissions: [...groupData.chosenPermissions, ...filteredAvailablePermissions],
        availablePermissions: groupData.availablePermissions.filter(p => 
          !filteredAvailablePermissions.some(fp => fp.id === p.id))
      });
    } else {
      setGroupData({
        ...groupData,
        availablePermissions: [...groupData.availablePermissions, ...filteredChosenPermissions],
        chosenPermissions: groupData.chosenPermissions.filter(p => 
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
            onClick={() => navigate('/groups')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Groups
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Change group</h1>
        </div>
        
        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Group Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-primary">
              {groupData.name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name:</Label>
              <Input 
                id="name" 
                name="name"
                value={groupData.name}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Permissions Card */}
        <Card>
          <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
            <CardTitle className="text-base font-medium">Permissions</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Available Permissions */}
              <div className="space-y-2">
                <div className="font-medium pb-1">Available permissions</div>
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
                <div className="font-medium pb-1">Chosen permissions</div>
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
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/groups')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => toast.success("Group details saved successfully")}>
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

export default GroupDetail;
