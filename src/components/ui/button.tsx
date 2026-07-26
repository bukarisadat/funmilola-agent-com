import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-110",
        hero: "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-105",
        accent:
          "bg-[image:var(--gradient-accent)] text-accent-foreground shadow-[var(--shadow-accent)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:brightness-110",
        outline:
          "border border-border bg-background/70 text-foreground backdrop-blur hover:border-primary hover:text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-primary-soft",
        glass: "glass-panel text-foreground hover:-translate-y-0.5",
        ghost: "hover:bg-primary-soft hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
