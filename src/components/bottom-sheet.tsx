import React from "react";

type BottomSheetProps = React.HTMLAttributes<HTMLDialogElement>;
export const BottomSheet = React.forwardRef<
    HTMLDialogElement,
    BottomSheetProps
>(({ className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDialogElement>(null);
    const effectiveRef = ref || internalRef;

    return (
        <dialog
            ref={effectiveRef}
            className="backdrop:bg-black backdrop:bg-opacity-50"
        >
            BottomSheet
        </dialog>
    );
});
BottomSheet.displayName = "BottomSheet";
