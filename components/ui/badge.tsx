import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary)]/12 text-[var(--primary)]",
        success: "border-transparent bg-[var(--accent)]/14 text-[var(--accent)]",
        myth: "border-transparent bg-[var(--myth)]/14 text-[var(--myth)]",
        outline: "border-[var(--border)] bg-transparent text-[var(--muted-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
