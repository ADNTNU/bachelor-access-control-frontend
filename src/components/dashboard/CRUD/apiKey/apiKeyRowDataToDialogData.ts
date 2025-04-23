"use server";

import type { APIEncode } from "@models/utils";
import type { ApiKeyDialogFields } from "./apiKeyFields";
import type { ApiKeyListDto } from "@models/dto/apiKey";

export async function apiKeyRowDataToDialogData(
  data: APIEncode<ApiKeyListDto>,
): Promise<ApiKeyDialogFields> {
  const { scopes, ...rest } = data;
  return {
    scopes: scopes?.length ? scopes.join(",") : "",
    ...rest,
  };
}
