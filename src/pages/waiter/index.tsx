import type { NextPage } from "next";
import Image from "next/image";
import React from "react";
import { TopAppBar } from "y/components/top-app-bar";

const Page: NextPage = () => {
  return (
    <>
      <TopAppBar />
      <main className="container flex flex-col gap-9 pb-5 pt-4">
        <header className="flex shrink-0 flex-col items-center gap-3">
          <Image
            src="https://api.dicebear.com/6.x/avataaars/svg?seed=Sammy"
            alt="Sammy's profile picture"
            height={PROFILE_IMAGE_SIZE}
            width={PROFILE_IMAGE_SIZE}
            className="rounded-full bg-black"
          />
          <p>Sammy Scooter</p>
        </header>
        <section
          aria-label="Shift summary"
          className="grid w-full grid-cols-2 grid-rows-2"
        >
          <SummaryItem
            label={"Estimated tips"}
            value={Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(108)}
          />
          <SummaryItem
            label={"Total sold"}
            value={Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(1080)}
          />
          <SummaryItem label={"Tables closed"} value={12} />
          <SummaryItem label={"Serving Tables"} value={"5".padStart(2, "0")} />
        </section>
      </main>
    </>
  );
};

export default Page;

const PROFILE_IMAGE_SIZE = 120;

type SummaryItemProps = {
  label: string;
  value: React.ReactNode;
};
const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-4 text-center">
      <h3 className="text-sm">{label}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
};
