import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useApp } from "../context/AppContext"; // Import useApp context
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AppProvider } from "../context/AppContext";
import { toast } from "../hooks/use-toast";
import { Loader } from "lucide-react"; // Import Loader from lucide-react

const Profile = () => {
  const { user, setUser, userLoading, setUserLoading } = useApp(); // Get user and loading state from context
  const [name, setName] = useState(user?.name || ""); // Ensure default values are set
  const [email, setEmail] = useState(user?.email || "");
  const [isSpecialAccess, setIsSpecialAccess] = useState(
    user?.isSpecialAccess || false
  );

  // If user data is still loading, show a loading spinner
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Loading spinner */}
        <Loader className="animate-spin text-white w-5 h-5" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  // If no user is found, show a message prompting to log in
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
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      isSpecialAccess,
    };

    setUser(updatedUser); // Update user context
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

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
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  {/* Display user name as plain text */}
                  <p>{user.name}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {/* Display user email as plain text */}
                  <p>{user.email}</p>
                </div>
              </CardContent>
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
