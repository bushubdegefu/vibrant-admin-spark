
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Loader2,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";
import { groupService, permissionService } from '@/api';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewGroup = id === 'new';
  const [groupData, setGroupData] = useState({ name: '' });
  const [searchPermissions, setSearchPermissions] = useState({ available: '', chosen: '' });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [chosenPermissions, setChosenPermissions] = useState([]);

  // Fetch group data if not a new group
  const { 
    data: groupDetails, 
    isLoading: isLoadingGroup,
    isError: isGroupError,
    error: groupError
  } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupService.getGroupById(id),
    enabled: !isNewGroup,
  });

  // Fetch all permissions
  const { 
    data: permissionsData,
    isLoading: isLoadingPermissions
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions(1, 100),
  });

  // Create/Update group mutation
  const saveGroupMutation = useMutation({
    mutationFn: (data) => {
      if (isNewGroup) {
        return groupService.createGroup(data);
      } else {
        return groupService.updateGroup(id, data);
      }
    },
    onSuccess: (data) => {
      toast.success(`Group ${isNewGroup ? 'created' : 'updated'} successfully`);
      if (isNewGroup && data?.data?.id) {
        // If a new group was created, navigate to its edit page
        navigate(`/groups/${data.data.id}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ['group', id] });
        queryClient.invalidateQueries({ queryKey: ['groups'] });
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isNewGroup ? 'create' : 'update'} group: ${error.message || 'Unknown error'}`);
    }
  });

  // Add permission to group mutation
  const addPermissionMutation = useMutation({
    mutationFn: ({ groupId, permissionId }) => 
      groupService.addPermissionToGroup(groupId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['groupPermissions', id] });
    },
    onError: (error) => {
      toast.error(`Failed to add permission: ${error.message || 'Unknown error'}`);
    }
  });

  // Remove permission from group mutation
  const removePermissionMutation = useMutation({
    mutationFn: ({ groupId, permissionId }) => 
      groupService.removePermissionFromGroup(groupId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['groupPermissions', id] });
    },
    onError: (error) => {
      toast.error(`Failed to remove permission: ${error.message || 'Unknown error'}`);
    }
  });

  // Load group data when available
  useEffect(() => {
    if (groupDetails?.data && !isNewGroup) {
      setGroupData({
        name: groupDetails.data.name || '',
      });
    }
  }, [groupDetails, isNewGroup]);

  // Setup permissions data
  useEffect(() => {
    if (permissionsData?.data) {
      // For a new group, all permissions are available
      if (isNewGroup) {
        setAvailablePermissions(permissionsData.data);
        setChosenPermissions([]);
      } else {
        // For existing groups, we need to fetch the assigned permissions separately
        // In this simplified example, we'll just use the permissions from the permissionsData
        // In a real app, you'd need to fetch the assigned permissions for this group
        
        // This is temporary until we implement the actual permission fetching
        const tempAvailable = permissionsData.data.slice(0, permissionsData.data.length / 2);
        const tempChosen = permissionsData.data.slice(permissionsData.data.length / 2);
        
        setAvailablePermissions(tempAvailable);
        setChosenPermissions(tempChosen);
      }
    }
  }, [permissionsData, isNewGroup]);

  // Filter functions
  const filteredAvailablePermissions = availablePermissions.filter(perm => 
    perm.codename?.toLowerCase().includes(searchPermissions.available.toLowerCase())
  );
  
  const filteredChosenPermissions = chosenPermissions.filter(perm => 
    perm.codename?.toLowerCase().includes(searchPermissions.chosen.toLowerCase())
  );

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const movePermission = (permission, direction) => {
    if (direction === 'to-chosen') {
      if (!isNewGroup) {
        addPermissionMutation.mutate({ 
          groupId: id, 
          permissionId: permission.id 
        });
      }
      
      setAvailablePermissions(availablePermissions.filter(p => p.id !== permission.id));
      setChosenPermissions([...chosenPermissions, permission]);
    } else {
      if (!isNewGroup) {
        removePermissionMutation.mutate({ 
          groupId: id, 
          permissionId: permission.id 
        });
      }
      
      setChosenPermissions(chosenPermissions.filter(p => p.id !== permission.id));
      setAvailablePermissions([...availablePermissions, permission]);
    }
  };

  const handleSave = () => {
    if (!groupData.name.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    
    saveGroupMutation.mutate(groupData);
  };

  const moveAllPermissions = (direction) => {
    if (direction === 'to-chosen') {
      if (!isNewGroup) {
        filteredAvailablePermissions.forEach(permission => {
          addPermissionMutation.mutate({ 
            groupId: id, 
            permissionId: permission.id 
          });
        });
      }
      
      setChosenPermissions([...chosenPermissions, ...filteredAvailablePermissions]);
      setAvailablePermissions(availablePermissions.filter(p => 
        !filteredAvailablePermissions.some(fp => fp.id === p.id)));
    } else {
      if (!isNewGroup) {
        filteredChosenPermissions.forEach(permission => {
          removePermissionMutation.mutate({ 
            groupId: id, 
            permissionId: permission.id 
          });
        });
      }
      
      setAvailablePermissions([...availablePermissions, ...filteredChosenPermissions]);
      setChosenPermissions(chosenPermissions.filter(p => 
        !filteredChosenPermissions.some(fp => fp.id === p.id)));
    }
  };

  // Handle errors
  if (isGroupError && !isNewGroup) {
    toast.error(`Failed to load group: ${groupError?.message || 'Unknown error'}`);
  }

  const isSaving = saveGroupMutation.isPending;
  const isLoading = isLoadingGroup || isLoadingPermissions;

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
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewGroup ? 'Add Group' : 'Edit Group'}
          </h1>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
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
      
      {isLoading && !isNewGroup ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span>Loading group details...</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Group Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-primary">
                {groupData.name || 'New Group'}
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
                  placeholder="Enter group name"
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
                            <div className="text-xs text-muted-foreground">Permission</div>
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
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => moveAllPermissions('to-chosen')}
                      disabled={filteredAvailablePermissions.length === 0 || addPermissionMutation.isPending}
                    >
                      {addPermissionMutation.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : 'Choose all'}
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
                            <div className="text-xs text-muted-foreground">Permission</div>
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
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => moveAllPermissions('to-available')}
                      disabled={filteredChosenPermissions.length === 0 || removePermissionMutation.isPending}
                    >
                      {removePermissionMutation.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : 'Remove all'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Bottom Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/groups')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : 'Save and continue editing'}
          </Button>
          <Button 
            onClick={() => {
              handleSave();
              if (!isSaving) navigate('/groups');
            }}
            disabled={isSaving}
          >
            {isSaving ? (
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
    </div>
  );
};

export default GroupDetail;
