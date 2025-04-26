
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/api";
import { Loader2, Users, UserCheck, UserCog, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch stats data
  const { data: statsData, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => statsService.getStats(),
  });

  // Card click handlers
  const handleUsersCardClick = () => navigate('/admin/users');
  const handleGroupsCardClick = () => navigate('/admin/groups');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Loading dashboard data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <CardTitle className="mb-4 text-red-500">Error Loading Dashboard</CardTitle>
        <CardDescription>
          There was a problem fetching the dashboard statistics. Please try refreshing the page.
        </CardDescription>
      </div>
    );
  }

  const stats = statsData?.data || {
    total_users: 0,
    active_users: 0,
    total_groups: 0,
    total_permissions: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleUsersCardClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              Total user accounts in the system
            </p>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleUsersCardClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              Currently active user accounts
            </p>
          </CardContent>
        </Card>

        {/* Groups Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGroupsCardClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Groups</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_groups}</div>
            <p className="text-xs text-muted-foreground">
              Permission groups configured in system
            </p>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_permissions}</div>
            <p className="text-xs text-muted-foreground">
              System permission definitions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Activity Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>
              The latest user logins and actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center">
              <p className="text-sm text-muted-foreground">
                User activity tracking will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Status Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">
                    Backend API connectivity
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Auth service status
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">
                    Database connectivity
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
