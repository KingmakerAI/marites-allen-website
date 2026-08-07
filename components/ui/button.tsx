import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-[-0.01em] transition duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0F5132] text-white shadow-[0_16px_40px_rgba(15,81,50,0.22)] hover:-translate-y-0.5 hover:bg-[#0a3d26]",
        gold:
          "bg-[#C6A348] text-[#171717] shadow-[0_16px_40px_rgba(198,163,72,0.26)] hover:-translate-y-0.5 hover:bg-[#d5b85d]",
        ivory:
          "bg-white text-[#0F5132] shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:bg-[#FAF8F2]",
        ghost:
          "border border-[#0F5132]/20 bg-white/60 text-[#0F5132] backdrop-blur hover:border-[#C6A348]/70 hover:bg-white"
      },
      size: {
        sm: "h-10 px-5",
        md: "h-12 px-7",
        lg: "h-14 px-9 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
