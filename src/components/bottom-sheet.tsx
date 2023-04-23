import React from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
  open?: boolean;
};

export const BottomSheet: React.FC<BottomSheetProps> = ({ open }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    createPortal(
      <div className="absolute bottom-0 left-0 right-0 w-full rounded-t-2xl bg-white shadow-elevation-1">
        <div
          aria-label="drag handle"
          className="flex h-9 w-full items-center justify-center"
        >
          <div className="h-1 w-8 cursor-move rounded-full bg-gray-400"></div>
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );
};
