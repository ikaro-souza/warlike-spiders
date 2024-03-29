import React from "react";
import Sheet from "react-modal-sheet";

type BottomSheetProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onClick"
> & {
    open: boolean;
    onClose: VoidFunction;
};
export type BottomSheetComposition = React.ForwardRefExoticComponent<
    BottomSheetProps & React.RefAttributes<HTMLDialogElement>
> & {
    Title: typeof BottomSheetTitle;
};

export const BottomSheet = React.forwardRef<
    HTMLDialogElement,
    React.PropsWithChildren<BottomSheetProps>
>(({ children, open, onClose, ...props }, ref) => {
    const backdropRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const backdrop = backdropRef.current;
        if (!backdrop) return;

        const onClick = () => {
            onClose();
        };
        backdrop.addEventListener("click", onClick);

        return () => {
            backdrop.removeEventListener("click", onClick);
        };
    }, [onClose]);

    return (
        <Sheet
            isOpen={open}
            onClose={onClose}
            ref={ref}
            detent="full-height"
            {...props}
        >
            <Sheet.Container className="rounded-t-lg bg-white">
                <Sheet.Header className="flex h-9 items-center justify-center">
                    <span className="sr-only">drag handle</span>
                    <div className="h-1 w-8 rounded bg-gray-300" />
                </Sheet.Header>
                <Sheet.Content className="flex h-full flex-col gap-4 px-4 py-4">
                    {children}
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop
                className="!pointer-events-auto"
                ref={backdropRef}
            />
        </Sheet>
    );
}) as BottomSheetComposition;
BottomSheet.displayName = "BottomSheet";

const BottomSheetTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className="text-center text-lg leading-6">{children}</div>
);
BottomSheet.Title = BottomSheetTitle;
