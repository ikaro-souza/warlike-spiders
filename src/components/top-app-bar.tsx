import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type TopAppBarProps = {
  previousUrl?: string;
};

export const TopAppBar: React.FunctionComponent<TopAppBarProps> = ({
  previousUrl,
}) => {
  return (
    <header className="flex h-10 items-center bg-white px-5">
      {previousUrl && (
        <div className="w-10">
          <Link href={previousUrl} passHref aria-label="back" title="back">
            <IconChevronLeft />
          </Link>
        </div>
      )}
      <h1 className="flex-1 text-center text-xs font-medium uppercase leading-snug">
        restaurant&apos;s name
      </h1>
    </header>
  );
};
