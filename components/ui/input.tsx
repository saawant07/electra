import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
