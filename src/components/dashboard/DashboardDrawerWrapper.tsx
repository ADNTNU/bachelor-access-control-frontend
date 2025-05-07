"use client";

import dynamic from "next/dynamic";

const DashboardDrawer = dynamic(
  () => import("@components/dashboard/DashboardDrawer"),
  { ssr: false },
);

export default DashboardDrawer;
