import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
import { TestProvider } from "@/contexts/AdminDialogContext/TestContext";
import { routes } from "@/routes";
import AdministratorDataGrid from "@components/dashboard/CRUD/administrator/AdministratorDataGrid";
import AdministratorDialogs from "@components/dashboard/CRUD/administrator/administratorDialogs";
import { administratorRowDataToDialogData } from "@components/dashboard/CRUD/administrator/administratorRowToDialogData";
import PageSection from "@components/layout/PageSection";
import { auth } from "@server/auth";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Users",
    description: "User administration page for bachelor access control system",
  };
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await auth();
  const token = session?.accessToken;
  const { companyId } = await params;

  if (!token) {
    console.warn("No token found, redirecting to unauthorized page");
    redirect(routes.error.unauthorized(routes.dashboard.users(companyId)));
  }

  return (
    <TestProvider>
      <AdminDialogProvider
        rowDataToDialogData={administratorRowDataToDialogData}
      >
        <PageSection noPaddingX>
          <AdministratorDataGrid token={token} />
        </PageSection>
        <AdministratorDialogs token={token} />
      </AdminDialogProvider>
    </TestProvider>
  );
}
