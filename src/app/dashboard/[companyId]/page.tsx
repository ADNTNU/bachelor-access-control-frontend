import { Typography } from "@mui/material";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  return <Typography>Dashboard for company ID: {companyId}</Typography>;
}
