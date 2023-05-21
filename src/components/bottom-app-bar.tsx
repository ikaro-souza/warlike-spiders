import clsx from "clsx";
import React from "react";

export function BottomAppBar({ children }: React.PropsWithChildren) {
    return (
        <div role="footer" className="fixed bottom-0 w-full">
            <div className="flex h-20 gap-2 bg-white px-4 py-3" role="toolbar">
                {children}
            </div>
        </div>
    );
}

type BottomAppBarActionsProps = Pick<
    React.HTMLAttributes<HTMLDivElement>,
    "role"
> & {
    shrink?: boolean;
};

export function BottomAppBarActions({
    children,
    shrink,
    ...props
}: React.PropsWithChildren<BottomAppBarActionsProps>) {
    return (
        <div
            role="list"
            className={clsx(
                "flex items-center gap-1",
                shrink ? "flex-shrink" : "flex-grow",
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function BottomAppBarAction({
    children,
    ...props
}: React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLDivElement>, "role">
>) {
    return (
        <div
            role="listitem"
            className="flex h-12 w-12 items-center justify-center"
            {...props}
        >
            {children}
        </div>
    );
}

export function BottomAppBarPrimaryAction({
    children,
    ...props
}: React.PropsWithChildren<
    Pick<React.HTMLAttributes<HTMLDivElement>, "className">
>) {
    return (
        <div className="flex-shrink" {...props}>
            {children}
        </div>
    );
}
