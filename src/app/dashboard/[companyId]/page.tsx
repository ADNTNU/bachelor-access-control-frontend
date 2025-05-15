import { UnauthenticatedError, UnauthorizedError } from "@/errors";
import { routes } from "@/routes";
import { Alert, Link, Typography } from "@mui/material";
import { auth } from "@server/auth";
import { fetchCompanies } from "@server/dashboard/fetchCompanies";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import NextLink from "next/link";
import PageSection from "@components/layout/PageSection";

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

  const company = companiesRes.find(
    (company) => company.id.toString() === companyId,
  );

  if (!company) {
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        <Typography variant="h6" component="h2">
          Company information not found.
        </Typography>
      </Alert>
    );
  }

  return (
    <PageSection noPaddingX sx={{ gap: 2 }} maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Dashboard for {company?.name}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage API keys and administrators for your company.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Use the navigation menu to the left to access different sections of the
        dashboard.
      </Typography>
      <Link
        href={routes.dashboard.administrators(companyId)}
        component={NextLink}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Administrators:
        </Typography>
      </Link>
      <Typography variant="body1">
        In this section, you can manage the administrators for your company. You
        can invite, remove, or update administrator accounts as needed. This
        ensures that only authorized personnel have access to the dashboard and
        its features.
      </Typography>
      <Link href={routes.dashboard.apiKeys(companyId)} component={NextLink}>
        <Typography variant="h5" component="h2" gutterBottom>
          API Keys:
        </Typography>
      </Link>
      <Typography variant="body1">
        In this section, you can manage the API keys for your company. You can
        create, revoke, or update keys as needed. Each key can have its own set
        of scopes that define the level of access it has to your company&apos;s
        data. This allows you to control access to your company&apos;s data and
        ensure that only authorized applications can interact with your data
        through the APIs.
      </Typography>
    </PageSection>
  );
}
