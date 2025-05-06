import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
import { routes } from "@/routes";
import ApiKeyDataGrid from "@components/dashboard/CRUD/apiKey/ApiKeyDataGrid";
import ApiKeyDialogs from "@components/dashboard/CRUD/apiKey/apiKeyDialogs";
import { apiKeyRowDataToDialogData } from "@components/dashboard/CRUD/apiKey/apiKeyRowDataToDialogData";
import { PageTitle } from "@components/dashboard/PageTitle";
import PageSection from "@components/layout/PageSection";
import { auth } from "@server/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Api Keys",
  description: "Api key administration page for bachelor access control system",
};

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await auth();
  const token = session?.accessToken;
  const { companyId } = await params;

  if (!token) {
    console.warn("No token found, redirecting to unauthorized page2");
    redirect(routes.error.unauthorized(routes.dashboard.apiKeys(companyId)));
  }

  return (
    <AdminDialogProvider rowDataToDialogData={apiKeyRowDataToDialogData}>
      <PageSection noPaddingX sx={{ gap: 2 }}>
        <PageTitle title="Api Keys" />
        <ApiKeyDataGrid currentUrl={routes.dashboard.apiKeys(companyId)} />
      </PageSection>
      <ApiKeyDialogs currentUrl={routes.dashboard.apiKeys(companyId)} />
    </AdminDialogProvider>
  );
}
