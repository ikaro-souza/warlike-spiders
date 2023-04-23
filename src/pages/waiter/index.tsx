import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import { TopAppBar } from "y/components/top-app-bar";
import { api } from "y/utils/api";

const DynamicBottomSheet = dynamic(
  () => import("y/components/bottom-sheet").then((mod) => mod.BottomSheet),
  {
    loading: () => <p>Loading...</p>,
  }
);

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
        <Summary />
        <DynamicBottomSheet />
      </main>
    </>
  );
};

export default Page;

const PROFILE_IMAGE_SIZE = 120;

const Summary = () => {
  const { data, isLoading } = api.table.getWaiterShiftSummary.useQuery();

  return !data ? (
    <p>loading...</p>
  ) : (
    <section
      aria-label="Shift summary"
      className="grid w-full grid-cols-2 grid-rows-2"
    >
      <SummaryItem
        label={"Estimated tips"}
        value={Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.estimatedTips)}
      />
      <SummaryItem
        label={"Total sold"}
        value={Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.totalSold)}
      />
      <SummaryItem label={"Tables closed"} value={data.tablesClosed} />
      <SummaryItem
        label={"Serving Tables"}
        value={data.servingTables.toString().padStart(2, "0")}
      />
    </section>
  );
};

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
