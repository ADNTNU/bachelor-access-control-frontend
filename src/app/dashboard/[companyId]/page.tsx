import { Typography } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Home",
  description: "Dashboard home page",
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  return <Typography>Dashboard for company ID: {companyId}</Typography>;
}
