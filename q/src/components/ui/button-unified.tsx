"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentStyles } from "@/lib/design-system"

const buttonUnifiedVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: componentStyles.button.primary,
        secondary: componentStyles.button.secondary,
        ghost: componentStyles.button.ghost,
        "blue-light": "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
        "zinc-light": "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70",
        outline: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-blue-400 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonUnifiedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonUnifiedVariants> {
  asChild?: boolean
}

const ButtonUnified = React.forwardRef<HTMLButtonElement, ButtonUnifiedProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonUnifiedVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonUnified.displayName = "ButtonUnified"

export { ButtonUnified, buttonUnifiedVariants } 