
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Save, 
  Globe, 
  Lock, 
  Mail, 
  Bell, 
  UserCog,
  Palette,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Django Admin Dashboard',
    description: 'Modern admin dashboard for Django applications',
    adminEmail: 'admin@example.com',
    language: 'en',
    timezone: 'UTC',
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'noreply@example.com',
    smtpPassword: '••••••••••••',
    defaultFromEmail: 'noreply@example.com',
    enableSmtpAuth: true,
    useTLS: true,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableBrowserNotifications: false,
    notifyOnNewUser: true,
    notifyOnNewComment: true,
    notifyOnError: true,
    digestFrequency: 'daily',
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: '30',
    allowedIPs: '',
    passwordMinLength: '8',
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    accentColor: 'blue',
    sidebarPosition: 'left',
    enableAnimations: true,
    compactMode: false,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleEmailSwitchChange = (name, checked) => {
    setEmailSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNotificationSwitchChange = (name, checked) => {
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSecuritySwitchChange = (name, checked) => {
    setSecuritySettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleAppearanceChange = (name, value) => {
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceSwitchChange = (name, checked) => {
    setAppearanceSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe size={16} />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          {/* <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail size={16} />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger> */}
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic information about your Django admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Site Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={generalSettings.description}
                    onChange={handleGeneralChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={generalSettings.language}
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={generalSettings.timezone}
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure email settings for sending notifications and system messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input 
                      id="smtpServer"
                      name="smtpServer"
                      value={emailSettings.smtpServer}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input 
                      id="smtpPort"
                      name="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input 
                      id="smtpUsername"
                      name="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input 
                      id="smtpPassword"
                      name="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultFromEmail">Default From Email</Label>
                  <Input 
                    id="defaultFromEmail"
                    name="defaultFromEmail"
                    type="email"
                    value={emailSettings.defaultFromEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableSmtpAuth" 
                      checked={emailSettings.enableSmtpAuth}
                      onCheckedChange={(checked) => handleEmailSwitchChange('enableSmtpAuth', checked)}
                    />
                    <Label htmlFor="enableSmtpAuth">Enable SMTP Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useTLS" 
                      checked={emailSettings.useTLS}
                      onCheckedChange={(checked) => handleEmailSwitchChange('useTLS', checked)}
                    />
                    <Label htmlFor="useTLS">Use TLS</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableEmailNotifications" 
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => handleNotificationSwitchChange('enableEmailNotifications', checked)}
                    />
                    <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableBrowserNotifications" 
                      checked={notificationSettings.enableBrowserNotifications}
                      onCheckedChange={(checked) => handleNotificationSwitchChange('enableBrowserNotifications', checked)}
                    />
                    <Label htmlFor="enableBrowserNotifications">Enable Browser Notifications</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notification Events</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifyOnNewUser" 
                        checked={notificationSettings.notifyOnNewUser}
                        onCheckedChange={(checked) => handleNotificationSwitchChange('notifyOnNewUser', checked)}
                      />
                      <Label htmlFor="notifyOnNewUser">New User Registration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifyOnNewComment" 
                        checked={notificationSettings.notifyOnNewComment}
                        onCheckedChange={(checked) => handleNotificationSwitchChange('notifyOnNewComment', checked)}
                      />
                      <Label htmlFor="notifyOnNewComment">New Comment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifyOnError" 
                        checked={notificationSettings.notifyOnError}
                        onCheckedChange={(checked) => handleNotificationSwitchChange('notifyOnError', checked)}
                      />
                      <Label htmlFor="notifyOnError">System Errors</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digestFrequency">Email Digest Frequency</Label>
                  <Select 
                    value={notificationSettings.digestFrequency}
                    onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, digestFrequency: value }))}
                  >
                    <SelectTrigger id="digestFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableTwoFactor" 
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSecuritySwitchChange('enableTwoFactor', checked)}
                  />
                  <div>
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a verification code in addition to password for login
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                    <Input 
                      id="allowedIPs"
                      name="allowedIPs"
                      value={securitySettings.allowedIPs}
                      onChange={handleSecurityChange}
                      placeholder="Leave blank to allow all IPs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple IPs with commas
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Password Requirements</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Length</Label>
                      <Input 
                        id="passwordMinLength"
                        name="passwordMinLength"
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="h-[21px]"></div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="passwordRequireSpecial" 
                          checked={securitySettings.passwordRequireSpecial}
                          onCheckedChange={(checked) => handleSecuritySwitchChange('passwordRequireSpecial', checked)}
                        />
                        <Label htmlFor="passwordRequireSpecial">Require Special Characters</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="passwordRequireNumbers" 
                          checked={securitySettings.passwordRequireNumbers}
                          onCheckedChange={(checked) => handleSecuritySwitchChange('passwordRequireNumbers', checked)}
                        />
                        <Label htmlFor="passwordRequireNumbers">Require Numbers</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={appearanceSettings.theme}
                      onValueChange={(value) => handleAppearanceChange('theme', value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <Select 
                      value={appearanceSettings.accentColor}
                      onValueChange={(value) => handleAppearanceChange('accentColor', value)}
                    >
                      <SelectTrigger id="accentColor">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="amber">Amber</SelectItem>
                        <SelectItem value="rose">Rose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sidebarPosition">Sidebar Position</Label>
                  <Select 
                    value={appearanceSettings.sidebarPosition}
                    onValueChange={(value) => handleAppearanceChange('sidebarPosition', value)}
                  >
                    <SelectTrigger id="sidebarPosition">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableAnimations" 
                      checked={appearanceSettings.enableAnimations}
                      onCheckedChange={(checked) => handleAppearanceSwitchChange('enableAnimations', checked)}
                    />
                    <Label htmlFor="enableAnimations">Enable Animations</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="compactMode" 
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) => handleAppearanceSwitchChange('compactMode', checked)}
                    />
                    <Label htmlFor="compactMode">Compact Mode</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default Settings;
