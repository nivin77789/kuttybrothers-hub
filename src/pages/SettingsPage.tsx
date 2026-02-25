import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun, User, Bell, Shield } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Layout showBack title="Settings">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">
        {/* Theme */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">{theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}</div>
              <div><CardTitle className="text-lg">Appearance</CardTitle><CardDescription>Customize the look and feel</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label className="text-base">Dark Mode</Label><p className="text-sm text-muted-foreground">Toggle between light and dark themes</p></div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
              <div><CardTitle className="text-lg">Profile</CardTitle><CardDescription>Your personal information</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input defaultValue="Admin User" /></div>
              <div><Label>Email</Label><Input defaultValue="admin@kuttybrothers.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
              <div><Label>Role</Label><Input defaultValue="Administrator" disabled /></div>
            </div>
            <Button className="gradient-primary text-white">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Bell className="h-5 w-5 text-primary" /></div>
              <div><CardTitle className="text-lg">Notifications</CardTitle><CardDescription>Manage notification preferences</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Email Notifications</Label><p className="text-sm text-muted-foreground">Receive email updates</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Invoice Alerts</Label><p className="text-sm text-muted-foreground">Get notified about overdue invoices</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Attendance Reports</Label><p className="text-sm text-muted-foreground">Daily attendance summary</p></div><Switch /></div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
              <div><CardTitle className="text-lg">Security</CardTitle><CardDescription>Manage your security settings</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Current Password</Label><Input type="password" placeholder="Enter current password" /></div>
            <div><Label>New Password</Label><Input type="password" placeholder="Enter new password" /></div>
            <Button variant="outline">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
