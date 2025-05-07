import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";
import DrawerToggleButton from "@components/dashboard/DashboardDrawerToggleButton";
import DrawerHeader from "@components/dashboard/DashboardDrawerHeader";
import DashboardAppBar from "@components/dashboard/DashboardAppBar";
import DashboardDrawerProvider from "@/contexts/DashboardDrawerContext/DashboardDrawerProvider";

import { auth } from "@server/auth";
import { redirect } from "next/navigation";
import { fetchCompanies } from "@server/dashboard/fetchCompanies";
import { routes } from "@/routes";
import { UnauthenticatedError, UnauthorizedError } from "@/errors";
import type { CompanySimpleDto } from "@models/dto/company";
import { Divider } from "@mui/material";
import CompanySelect from "@components/dashboard/CompanySelect";
import DashboardDrawerWrapper from "@components/dashboard/DashboardDrawerWrapper";

/**
 * DashboardLayout component that provides a layout for the dashboard pages.
 * It includes a navigation drawer and an app bar.
 * It fetches the administrators's companies and checks for authentication.
 *
 * @param props - The props for the DashboardLayout component.
 * @param props.children - The child components to be rendered inside the layout.
 * @param props.params - The url parameters passed to the layout, including the companyId.
 * @returns The DashboardLayout component.
 */
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

  const companiesRes = await fetchCompanies(token).catch(
    (error: Error) => error,
  );

  if (companiesRes instanceof UnauthenticatedError) {
    redirect(routes.auth.signOut(routes.dashboard.home(companyId)));
  } else if (companiesRes instanceof UnauthorizedError) {
    redirect(routes.error.unauthorized(routes.dashboard.home(companyId)));
  } else if (companiesRes instanceof Error) {
    redirect(routes.error.unknown(routes.dashboard.home(companyId)));
  }

  const companies: CompanySimpleDto[] = companiesRes;

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
            <Box>
              <CompanySelect
                companies={companies}
                selectedCompanyId={companyId}
                onSelectCompany={"navigate"}
              />
            </Box>
            <Divider orientation="vertical" />
            <Typography variant="h6" noWrap>
              Horizon access control
            </Typography>
          </Toolbar>
        </DashboardAppBar>
        <DashboardDrawerWrapper companyId={companyId} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <DrawerHeader />
          {children}
        </Box>
      </DashboardDrawerProvider>
    </Box>
  );
}
