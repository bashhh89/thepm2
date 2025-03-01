import React from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button>Upload Document</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Recent Documents</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Access your recently viewed or edited documents
            </p>
            <Button variant="outline" className="w-full">View Recent</Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Shared Documents</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Documents shared with you by team members
            </p>
            <Button variant="outline" className="w-full">View Shared</Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Templates</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start from pre-made document templates
            </p>
            <Button variant="outline" className="w-full">Browse Templates</Button>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Document Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Contracts', 'Proposals', 'Reports', 'Invoices', 'Marketing', 'Legal'].map((category) => (
              <Button key={category} variant="ghost" className="justify-start h-auto py-4">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
