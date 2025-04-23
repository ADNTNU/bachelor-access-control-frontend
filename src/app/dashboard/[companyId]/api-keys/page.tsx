import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
import { routes } from "@/routes";
import ApiKeyDataGrid from "@components/dashboard/CRUD/apiKey/ApiKeyDataGrid";
import ApiKeyDialogs from "@components/dashboard/CRUD/apiKey/apiKeyDialogs";
import { apiKeyRowDataToDialogData } from "@components/dashboard/CRUD/apiKey/apiKeyRowDataToDialogData";
import PageSection from "@components/layout/PageSection";
import { auth } from "@server/auth";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Api Keys",
    description:
      "Api key administration page for bachelor access control system",
  };
}

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await auth();
  const token = session?.accessToken;
  const { companyId } = await params;

  if (!token) {
    console.warn("No token found, redirecting to unauthorized page");
    redirect(routes.error.unauthorized(routes.dashboard.apiKeys(companyId)));
  }

  return (
    <AdminDialogProvider rowDataToDialogData={apiKeyRowDataToDialogData}>
      <PageSection noPaddingX>
        <ApiKeyDataGrid token={token} />
      </PageSection>
      <ApiKeyDialogs token={token} />
    </AdminDialogProvider>
  );
}
