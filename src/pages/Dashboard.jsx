
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
} from 'recharts';
import { ArrowUpRight, Users, FileText, Clock, Dot } from 'lucide-react';

// Mock data
const lineData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 40 },
];

const barData = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 80 },
  { name: 'Fri', value: 99 },
  { name: 'Sat', value: 43 },
  { name: 'Sun', value: 25 },
];

const pieData = [
  { name: 'Users', value: 540 },
  { name: 'Posts', value: 620 },
  { name: 'Comments', value: 210 },
];

const COLORS = ['#3b82f6', '#10b981', '#f97316'];

const recentActivities = [
  { id: 1, user: 'John Smith', action: 'created a new post', time: '5 min ago' },
  { id: 2, user: 'Emma Johnson', action: 'updated their profile', time: '20 min ago' },
  { id: 3, user: 'Michael Brown', action: 'commented on a post', time: '1 hour ago' },
  { id: 4, user: 'Sarah Davis', action: 'uploaded a new image', time: '2 hours ago' },
  { id: 5, user: 'David Wilson', action: 'created a new category', time: '3 hours ago' },
];

const Dashboard = () => {
  const [chartTab, setChartTab] = useState('traffic');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <small className="text-sm text-muted-foreground">Last updated: Today at 10:30 AM</small>
      </div>
      
      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Users" 
          value="3,254" 
          change="+12.5%" 
          icon={<Users />}
          chartData={[35, 50, 20, 70, 40, 60, 80]}
        />
        <StatsCard 
          title="Total Posts" 
          value="12,894" 
          change="+5.2%" 
          icon={<FileText />}
          chartData={[45, 20, 60, 30, 80, 40, 90]}
        />
        <StatsCard 
          title="Active Users" 
          value="1,429" 
          change="+28.4%" 
          icon={<Users />}
          chartData={[20, 40, 60, 80, 60, 40, 20]}
        />
        <StatsCard 
          title="Recent Posts" 
          value="254" 
          change="+3.1%" 
          icon={<Clock />}
          chartData={[80, 70, 60, 50, 40, 30, 20]}
        />
      </div>
      
      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Tabs defaultValue="traffic" value={chartTab} onValueChange={setChartTab}>
              <div className="flex items-center justify-between">
                <CardTitle>Analytics Overview</CardTitle>
                <TabsList>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {chartTab === 'traffic' 
                  ? 'Website traffic over the past 7 months' 
                  : 'User engagement over the past week'}
              </CardDescription>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === 'traffic' ? (
                  <LineChart data={lineData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Data Distribution</CardTitle>
            <CardDescription>Distribution of content across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '0.5rem',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions performed on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">{activity.user.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock size={12} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Stats card component with sparkline
const StatsCard = ({ title, value, change, icon, chartData }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg p-2 bg-primary/10">
            {icon}
          </div>
          
          <div className={`text-xs font-medium flex items-center gap-0.5 ${
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {change}
            <ArrowUpRight size={14} className={isPositive ? '' : 'rotate-180'} />
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        
        <div className="mt-3 h-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M ${chartData.map((d, i) => `${i * 20} ${40 - d * 0.4}`).join(' L ')}`}
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
