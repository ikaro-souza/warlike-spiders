import { IconMinus, IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { Button } from "./button";

type QuantityCounterProps = {
    buttonsClassName?: string;
    subtractButtonClassName?: string;
    addButtonClassName?: string;
    quantity: number;
    onChange: (_: number) => void;
};
export const QuantityCounter = ({
    onChange,
    quantity,
    addButtonClassName,
    buttonsClassName,
    subtractButtonClassName,
}: QuantityCounterProps) => {
    const className = "h-12 w-12 text-black";
    const effectiveSubtractButtonClassName = clsx(
        className,
        buttonsClassName,
        subtractButtonClassName,
    );
    const effectiveAddButtonClassName = clsx(
        className,
        buttonsClassName,
        addButtonClassName,
    );

    const changeQuantity = (action: "add" | "subtract") => {
        if (action === "add") {
            onChange(quantity + 1);
        } else {
            onChange(quantity - 1);
        }
    };

    return (
        <div className="flex h-full flex-shrink items-center gap-1">
            <Button
                className={effectiveSubtractButtonClassName}
                variant="icon"
                onClick={() => changeQuantity("subtract")}
                disabled={quantity === 1}
            >
                <IconMinus />
            </Button>
            <span className="block w-5 text-center font-medium">
                {quantity}
            </span>
            <Button
                className={effectiveAddButtonClassName}
                variant="icon"
                onClick={() => changeQuantity("add")}
            >
                <IconPlus />
            </Button>
        </div>
    );
};
