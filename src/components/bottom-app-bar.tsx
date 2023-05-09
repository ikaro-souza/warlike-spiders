import React from "react";

export function BottomAppBar({ children }: React.PropsWithChildren) {
    return (
        <div role="footer" className="fixed bottom-0 w-full">
            <div
                className="flex h-20 items-stretch gap-2 bg-white px-4 py-3"
                role="toolbar"
            >
                {children}
            </div>
        </div>
    );
}

export function BottomAppBarActions({
    children,
}: React.PropsWithChildren<
    Pick<React.HTMLAttributes<HTMLDivElement>, "role">
>) {
    return (
        <div role="list" className="flex-grow gap-1">
            {children}
        </div>
    );
}

export function BottomAppBarAction({
    children,
    ...props
}: React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "role">
>) {
    return (
        <div role="listitem" className="aspect-square" {...props}>
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
