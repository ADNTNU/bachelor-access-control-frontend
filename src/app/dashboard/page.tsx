import { routes } from "@/routes";
import { auth } from "@server/auth";
import { fetchCompanies } from "@server/dashboard/fetchCompanies";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  const token = session?.accessToken ?? null;

  if (!token) {
    redirect(routes.auth.login(routes.dashboard.index));
  }

  const companies = await fetchCompanies(token);

  console.log("Companies:", companies);

  if (!companies.length) {
    redirect(routes.error.noCompanies);
  } else {
    redirect(routes.dashboard.home(companies[0]!.id));
  }
}
