// app/_components/ui/select.tsx
import * as React from "react";
import { cn } from "../../_lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-md border bg-[var(--surface)] px-3.5 py-1.5 text-sm text-[var(--text)]",
          "outline-none transition-all duration-150 border-b-2",
          error
            ? "border-[var(--line)] border-b-[var(--red-pen)]"
            : "border-[var(--line)] focus:border-b-[var(--red-pen)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
