import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";
import DrawerToggleButton from "@components/dashboard/DashboardDrawerToggleButton";
import DrawerHeader from "@components/dashboard/DashboardDrawerHeader";
import DashboardAppBar from "@components/dashboard/DashboardAppBar";
import DashboardDrawerProvider from "@components/dashboard/DashboardDrawerProvider";
import DashboardDrawer from "@components/dashboard/DashboardDrawer";
import { auth } from "@server/auth";
import { redirect } from "next/navigation";
import { fetchCompanies } from "@server/dashboard/fetchCompanies";
import { routes } from "@/routes";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const session = await auth();

  const token = session?.accessToken ?? null;

  if (!token) {
    redirect(routes.auth.login(routes.dashboard.home(companyId)));
  }

  const companies = await fetchCompanies(token);

  if (companies.length === 0) {
    redirect(routes.error.noCompanies);
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <DashboardDrawerProvider defaultOpen={true}>
        <DashboardAppBar>
          <Toolbar
            disableGutters
            sx={{
              px: 1,
              gap: 2,
            }}
          >
            <DrawerToggleButton />
            <Typography variant="h6" noWrap>
              Horizon access control
            </Typography>
          </Toolbar>
        </DashboardAppBar>
        <DashboardDrawer companyId={companyId} companies={companies} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <DrawerHeader />
          {children}
        </Box>
      </DashboardDrawerProvider>
    </Box>
  );
}
