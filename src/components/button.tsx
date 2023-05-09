import clsx from "clsx";
import React, { cloneElement } from "react";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
    variant?: "outlined" | "filled" | "text";
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    disabled?: boolean;
};

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    children,
    className,
    leftIcon,
    rightIcon,
    variant = "text",
    disabled,
    ...props
}) => {
    return (
        <button
            className={clsx(
                "flex items-center justify-center px-3 py-2 text-sm font-medium text-action",
                variant === "outlined" && "border border-action bg-current",
                variant === "filled" && "bg-black text-white",
                className,
                variant === "outlined" && disabled && "border-gray-400",
                variant === "filled" && disabled && "bg-gray-100",
                disabled && "text-gray-400",
            )}
            disabled={disabled}
            {...props}
        >
            {leftIcon && cloneElement(leftIcon, { className: "h-6 w-6" })}
            {children}
            {rightIcon && cloneElement(rightIcon, { className: "h-6 w-6" })}
        </button>
    );
};
