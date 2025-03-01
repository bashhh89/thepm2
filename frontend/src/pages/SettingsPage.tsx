import React from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">AI Assistant Preferences</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Default AI Model</h3>
                    <p className="text-sm text-muted-foreground">Select your preferred AI model for chat</p>
                  </div>
                  <select className="px-3 py-2 border rounded-md">
                    <option value="gpt-4o-mini">GPT-4o Mini (Default)</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="mistral-large">Mistral Large</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Chat History</h3>
                    <p className="text-sm text-muted-foreground">Manage your conversation history</p>
                  </div>
                  <Button variant="outline">Clear History</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Interface Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
                  </div>
                  <select className="px-3 py-2 border rounded-md">
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-muted-foreground">Set your preferred language</p>
                  </div>
                  <select className="px-3 py-2 border rounded-md">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  'Email notifications',
                  'Push notifications',
                  'Monthly reports',
                  'Team mentions',
                ].map((setting) => (
                  <div key={setting} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{setting}</h3>
                      <p className="text-sm text-muted-foreground">Receive {setting.toLowerCase()}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Your Company" />
                  </div>
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6 border-destructive">
              <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
