import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { cn } from "../utils/cn";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export default function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
