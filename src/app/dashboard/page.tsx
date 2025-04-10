import { routes } from "@/routes";
import { auth } from "@server/auth";
import { fetchCompanies } from "@server/dashboard/fetchCompanies";
import { redirect } from "next/navigation";
import { UnauthenticatedError, UnauthorizedError } from "@/errors";
import type { Company } from "@models/backend/company";

export default async function DashboardPage() {
  const session = await auth();

  const token = session?.accessToken ?? null;

  if (!token) {
    redirect(routes.auth.login(routes.dashboard.index));
  }

  const companiesRes = await fetchCompanies(token).catch(
    (error: Error) => error,
  );

  console.log("companiesRes", companiesRes);

  if (companiesRes instanceof UnauthenticatedError) {
    redirect(routes.auth.signOut(routes.dashboard.index));
  } else if (companiesRes instanceof UnauthorizedError) {
    redirect(routes.error.unauthorized(routes.dashboard.index));
  } else if (companiesRes instanceof Error) {
    redirect(routes.error.unknown(routes.dashboard.index));
  }

  const companies: Company[] = companiesRes;

  if (!companies.length) {
    redirect(routes.error.noCompanies);
  } else {
    redirect(routes.dashboard.home(companies[0]!.id));
  }
}
