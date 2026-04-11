import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "ghost" | "outline";
type ButtonSize = "default" | "lg" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  default: "ui-btn ui-btn-default",
  ghost: "ui-btn ui-btn-ghost",
  outline: "ui-btn ui-btn-outline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "ui-btn-default-size",
  lg: "ui-btn-lg",
  sm: "ui-btn-sm",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            variantClasses[variant],
            sizeClasses[size],
            (children as React.ReactElement<{ className?: string }>).props
              ?.className,
            className
          ),
        }
      );
    }

    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
