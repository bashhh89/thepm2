import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Textarea } from '../components/Textarea';
import { Input } from '../components/Input';
import { Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export default function JobsPage() {
  const handleGenerateJobPost = async () => {
    try {
      const response = await window.puter.ai.chat(
        "Generate a job post for a Software Engineer role",
        false,
        { model: 'gpt-4o-mini', stream: false }
      );
      if (response && response.message && response.message.content) {
        toast.success("Job post generated!");
        console.log("Generated Job Post:", response.message.content);
        // You can further process or display the generated job post here
      } else {
        toast.error("Failed to generate job post.");
        console.error("AI response was empty or missing content");
      }
    } catch (error) {
      console.error("Error generating job post with AI:", error);
      toast.error("Error generating job post.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-4">
      <h1 className="text-2xl font-bold mb-4">IS THIS TEST PAGE SHOWING UP YET? - Job Postings</h1>
        <p className="text-gray-600 mb-4">Manage your job listings and create new postings with AI assistance.</p>

        <Button onClick={handleGenerateJobPost} className="bg-primary text-white hover:bg-primary/80">
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Job Post with AI
        </Button>

        <div className="mt-4">
          {/* You can add a display area for generated job posts here if needed */}
          <Textarea placeholder="Generated job post will appear here (check console for now)" readOnly rows={5} />
        </div>
      </Card>
    </div>
  );
}
