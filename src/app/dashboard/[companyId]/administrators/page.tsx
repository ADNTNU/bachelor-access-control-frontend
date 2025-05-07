import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
import { TestProvider } from "@/contexts/AdminDialogContext/TestContext";
import { routes } from "@/routes";
import AdministratorDataGrid from "@components/dashboard/CRUD/administrator/AdministratorDataGrid";
import AdministratorDialogs from "@components/dashboard/CRUD/administrator/administratorDialogs";
import { administratorRowDataToDialogData } from "@components/dashboard/CRUD/administrator/administratorRowToDialogData";
import { PageTitle } from "@components/dashboard/PageTitle";
import PageSection from "@components/layout/PageSection";
import { auth } from "@server/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Administrators",
  description:
    "Administration page for managing administrators in the company.",
};

export default async function AdministratorsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await auth();
  const token = session?.accessToken;
  const { companyId } = await params;

  if (!token) {
    console.warn("No token found, redirecting to unauthorized page1");
    redirect(
      routes.error.unauthorized(routes.dashboard.administrators(companyId)),
    );
  }

  return (
    <TestProvider>
      <AdminDialogProvider
        rowDataToDialogData={administratorRowDataToDialogData}
      >
        <PageSection noPaddingX sx={{ gap: 2 }}>
          <PageTitle title="Administrators" />
          <AdministratorDataGrid
            currentUrl={routes.dashboard.administrators(companyId)}
          />
        </PageSection>
        <AdministratorDialogs
          currentUrl={routes.dashboard.administrators(companyId)}
        />
      </AdminDialogProvider>
    </TestProvider>
  );
}
