import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] hover:brightness-110",
        secondary:
          "border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
        accent:
          "border-transparent bg-[var(--accent)] px-4 py-2 text-[var(--accent-foreground)] hover:brightness-110",
        destructive:
          "border-transparent bg-[var(--myth)] px-4 py-2 text-[var(--myth-foreground)] hover:brightness-110",
        ghost:
          "border-transparent bg-transparent px-3 py-2 text-[var(--muted-foreground)] hover:bg-white/8 hover:text-[var(--foreground)]",
      },
      size: {
        default: "h-11",
        sm: "h-10 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-5",
        icon: "h-11 w-11 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
