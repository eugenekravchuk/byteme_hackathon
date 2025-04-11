
import React from 'react';
import { useApp } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { AppProvider } from '../context/AppContext';
import { toast } from '../hooks/use-toast';
import { Shield } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useApp();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [isSpecialAccess, setIsSpecialAccess] = React.useState(user?.isSpecialAccess || false);
  
  const handleSave = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name,
      email,
      isSpecialAccess
    };
    
    setUser(updatedUser);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Please sign in to view and edit your profile.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Go to Sign In
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileWithProvider = () => (
  <AppProvider>
    <Profile />
  </AppProvider>
);

export default ProfileWithProvider;
