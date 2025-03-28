'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@/components/ui/dialog";

interface AgentFormProps {
  agent?: {
    id: string;
    name: string;
    system_prompt: string;
  };
  onSubmit: (agent: { id?: string; name: string; system_prompt: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function AgentForm({ agent, onSubmit, onCancel }: AgentFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(agent?.name || "");
  const [systemPrompt, setSystemPrompt] = useState(agent?.system_prompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!agent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Agent name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!systemPrompt.trim()) {
      toast({
        title: "Error",
        description: "System prompt is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({
        id: agent?.id,
        name: name.trim(),
        system_prompt: systemPrompt.trim(),
      });
      
      toast({
        title: "Success",
        description: isEditMode ? "Agent updated successfully" : "New agent created successfully",
      });
      
      if (!isEditMode) {
        // Reset form if creating a new agent
        setName("");
        setSystemPrompt("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input
          id="name"
          placeholder="Enter agent name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <Textarea
          id="systemPrompt"
          placeholder="Define the behavior and capabilities of your agent"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          disabled={isLoading}
          className="min-h-[200px]"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditMode ? "Update Agent" : "Create Agent"}
        </Button>
      </div>
    </form>
  );
}