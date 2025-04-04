
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
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { groupService, permissionService } from '@/api';
import ErrorBoundary from '../components/ErrorBoundary';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [groupData, setGroupData] = useState({ name: '' });
  const [searchPermissions, setSearchPermissions] = useState({ available: '', chosen: '' });
  
  // Fetch group data if not a new group
  const { 
    data: groupDetails, 
    isLoading: isLoadingGroup,
    isError: isGroupError,
    error: groupError
  } = useQuery({
    queryKey: ['single_group', id],
    queryFn: () => groupService.getGroupById(id),
    
  });

  // Fetch permissions for existing groups
  const { 
    data: groupComplementPermissions
  } = useQuery({
    queryKey: ["group_comp_permissions", id],
    queryFn:()=> groupService.getAvailablePermissionsForGroup(id),
  });

  const { 
    data: groupPermissions
  } = useQuery({
    queryKey: ["group_permissions", id],
    queryFn:()=> groupService.getAttachedPermissionsForGroup(id),
  });

  // Create/Update group mutation
  const saveGroupMutation = useMutation({
    mutationFn: groupService.updateGroup,
    onSuccess: (data) => {
      toast.success(`Group ${'updated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['single_group'] });
       
    },
    onError: (error) => {
      toast.error(`Failed to update group: ${error.message || 'Unknown error'}`);
    }
  });
  // Add permission to group mutation
  const {mutate: addPermissionMutationToGroup} = useMutation({
    mutationFn: groupService.addPermissionToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_permissions', id] });
      queryClient.invalidateQueries({ queryKey: ['group_comp_permissions', id] });
    },
    onError: (error) => {
      toast.error(`Failed to add permission: ${error.message || 'Unknown error'}`);
    }
  });

  // Remove permission from group mutation
  const {mutate: removePermissionMutationFromGroup } = useMutation({
    mutationFn: groupService.removePermissionFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_permissions', id] });
      queryClient.invalidateQueries({ queryKey: ['group_comp_permissions', id] });
    },
    onError: (error) => {
      toast.error(`Failed to remove permission: ${error.message || 'Unknown error'}`);
    }
  });

  // Load group data when available
  useEffect(() => {
      setGroupData({ 
        name: groupDetails?.data.name,
      });  
    
  }, [groupDetails]);

  // Filtered permissions
  const filteredAvailablePermissions =
    groupComplementPermissions?.data?.filter((perm) =>
      perm.codename.toLowerCase().includes(searchPermissions.available.toLowerCase())
    ) || [];

  const filteredChosenPermissions =
    groupPermissions?.data?.filter((perm) =>
      perm.codename.toLowerCase().includes(searchPermissions.chosen.toLowerCase())
    ) || [];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const movePermission = (permissionId, direction) => {
    if (direction === "add") {
      addPermissionMutationToGroup({ groupId: id, permissionId });
    } else {
      removePermissionMutationFromGroup({ groupId: id, permissionId });
    }
  };

  const handleSave = () => {
    if (!groupData.name.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    console.log("Saving group data:", groupData);
    saveGroupMutation.mutate({groupId: id, groupData});
  };

  const isSaving = saveGroupMutation.isPending;
  const isLoading = isLoadingGroup;

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
            {'Edit Group'}
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
      
      {isLoading ? (
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
                {groupData?.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name:</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={groupData?.name}
                  onChange={handleInputChange}
                  placeholder="Enter group name"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The name is how the group will appear to users.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Permissions Card - Only show for existing groups */}
          
            <Card>
              <CardHeader className="py-4 px-6 bg-slate-100 dark:bg-slate-800">
                <CardTitle className="text-base font-medium">Permissions</CardTitle>
                <CardDescription>
                  Assign specific permissions to this group. Users in this group will inherit these permissions.
                </CardDescription>
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
                    <div className="font-medium pb-1">Chosen permissions</div>
                    <div className="relative">
                      <Input 
                        placeholder="Filter..." 
                        value={searchPermissions.chosen}
                        onChange={(e) => setSearchPermissions({...searchPermissions, chosen: e.target.value})}
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
                  These permissions will be applied to all users in this group.
                </p>
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
        <Button 
          onClick={handleSave}
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
  );
};

export default GroupDetail;
