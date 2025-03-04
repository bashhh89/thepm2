import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuthStore } from "../utils/auth-store";
import { Button } from "../components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card";

export default function Profile() {
  const { user, updateUserProfile, logOut } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateUserProfile(displayName);
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const lastSignIn = user?.metadata?.lastSignInTime 
    ? new Date(user.metadata.lastSignInTime).toLocaleString()
    : "Not available";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-900/10 to-background">
        <header className="bg-background/50 backdrop-blur-sm border-b border-purple-800/20 py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              Profile Management
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="backdrop-blur-sm bg-card/50 border-purple-800/20">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-purple-500/10 text-purple-300 text-sm p-3 rounded-md mb-4 border border-purple-500/20">
                    {success}
                  </div>
                )}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      className="w-full p-2 text-sm border rounded-md bg-background/50"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium leading-none">
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-background/50"
                      placeholder="Your Name"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                        Updating...
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="text-sm text-muted-foreground text-center mt-2">
                  Last signed in: {lastSignIn}
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
