import React from "react";
import Sheet from "react-modal-sheet";

type BottomSheetProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onClick"
> & {
    open: boolean;
    onClose: VoidFunction;
};
export const BottomSheet = React.forwardRef<
    HTMLDialogElement,
    React.PropsWithChildren<BottomSheetProps>
>(({ children, open, onClose, ...props }, ref) => {
    const backdropRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const backdrop = backdropRef.current;
        const onClick = onClose;
        backdrop?.addEventListener("click", onClick);

        return () => {
            backdrop?.removeEventListener("click", onClick);
        };
    }, [onClose]);

    return (
        <Sheet
            isOpen={open}
            onClose={onClose}
            snapPoints={[0.5]}
            ref={ref}
            onClick={onClose}
            {...props}
        >
            <Sheet.Container>
                <Sheet.Content className="flex h-full flex-col gap-4 rounded-t-lg bg-white px-4 py-6">
                    {children}
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop className="!pointer-events-auto" ref={ref} />
        </Sheet>
    );
});
BottomSheet.displayName = "BottomSheet";

export const BottomSheetHeader: React.FC<React.PropsWithChildren> = ({
    children,
}) => <Sheet.Header className="text-center text-lg">{children}</Sheet.Header>;
