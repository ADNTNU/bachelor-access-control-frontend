import type { Company } from "@models/backend/company";

export async function fetchCompanies(token: string) {
  // TODO: Add correct API URL
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/company/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 * 15 }, // 15 minutes
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json() as Promise<Company[]>;
}
