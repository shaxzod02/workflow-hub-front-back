import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { OnlineUsers } from '@/components/realtime/OnlineUsers';
import { LiveUpdates } from '@/components/realtime/LiveUpdates';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    mentions: true,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF (max. 2MB)
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Get weekly progress summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weekly}
                    onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mentions & Comments</p>
                    <p className="text-sm text-muted-foreground">Notify when mentioned or commented</p>
                  </div>
                  <Switch
                    checked={notifications.mentions}
                    onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Update your password to keep your account secure
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="border-t pt-4">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Real-time Features */}
          <OnlineUsers />
          <LiveUpdates />

          {/* Organization Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Your current organization details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">WorkflowHub Enterprise</p>
                  <p className="text-sm text-muted-foreground">Premium Plan</p>
                </div>
                <div className="text-sm">
                  <p><span className="text-muted-foreground">Members:</span> 12/25</p>
                  <p><span className="text-muted-foreground">Projects:</span> 8/50</p>
                  <p><span className="text-muted-foreground">Storage:</span> 2.4GB/10GB</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Organization
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Import Projects
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                API Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Help Center
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Feature Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};