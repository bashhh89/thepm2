import * as React from "react"
import { cn } from "@/lib/utils"
import { componentStyles } from "@/lib/design-system"

export interface CardUnifiedProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'interactive'
  noPadding?: boolean
}

const CardUnified = React.forwardRef<HTMLDivElement, CardUnifiedProps>(
  ({ className, variant = 'default', noPadding = false, ...props }, ref) => {
    const baseClasses = componentStyles.card.base
    const hoverClasses = variant === 'interactive' ? componentStyles.card.hover : ''
    const activeClasses = variant === 'active' ? componentStyles.card.active : ''
    const paddingClasses = noPadding ? 'p-0' : ''
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          hoverClasses,
          activeClasses,
          paddingClasses,
          className
        )}
        {...props}
      />
    )
  }
)
CardUnified.displayName = "CardUnified"

const CardUnifiedHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardUnifiedHeader.displayName = "CardUnifiedHeader"

const CardUnifiedTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-medium", className)}
    {...props}
  />
))
CardUnifiedTitle.displayName = "CardUnifiedTitle"

const CardUnifiedDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-400", className)}
    {...props}
  />
))
CardUnifiedDescription.displayName = "CardUnifiedDescription"

const CardUnifiedContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardUnifiedContent.displayName = "CardUnifiedContent"

const CardUnifiedFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardUnifiedFooter.displayName = "CardUnifiedFooter"

// For icon placement at top-right
const CardUnifiedIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute top-4 right-4", className)}
    {...props}
  />
))
CardUnifiedIcon.displayName = "CardUnifiedIcon"

// For decoration purposes (like the colorful blobs seen in workspace design)
const CardUnifiedDecoration = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { color?: string }
>(({ className, color = "#3b82f6", ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20", className)}
    style={{ backgroundColor: color }}
    {...props}
  />
))
CardUnifiedDecoration.displayName = "CardUnifiedDecoration"

export { 
  CardUnified, 
  CardUnifiedHeader, 
  CardUnifiedFooter, 
  CardUnifiedTitle, 
  CardUnifiedDescription, 
  CardUnifiedContent,
  CardUnifiedIcon,
  CardUnifiedDecoration
} 