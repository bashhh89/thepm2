import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  description,
  icon,
  buttonText,
  onClick,
  disabled = false,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children || (
          <div className="h-24 rounded-md bg-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">Coming Soon</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full justify-center" 
          onClick={onClick}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
