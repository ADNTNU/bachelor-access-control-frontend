"use server";

import {
  UnauthenticatedError,
  UnauthorizedError,
  UnknownError,
} from "@/errors";
import type { Company } from "@models/backend/company";
import { createHash } from "crypto";
import { revalidateTag } from "next/cache";

export async function fetchCompanies(token: string) {
  // TODO: Add correct API URL
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/company/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 * 15, tags: [getTokenSpecificCacheKey(token)] },
  });

  if (res.status === 401) {
    throw new UnauthenticatedError("Token expired or invalid");
  }

  if (res.status === 403) {
    throw new UnauthorizedError(
      "You don't have permission to access this resource",
    );
  }

  if (!res.ok) {
    throw new UnknownError(
      "An unknown error occurred while fetching companies",
    );
  }

  return res.json() as Promise<Company[]>;
}

function getTokenSpecificCacheKey(token: string) {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return `companies-${tokenHash}`;
}

export async function revalidateCompaniesCache(token: string) {
  const cacheKey = getTokenSpecificCacheKey(token);
  revalidateTag(cacheKey);
}
