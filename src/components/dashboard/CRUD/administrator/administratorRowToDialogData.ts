"use server";

import type { AdministratorListDto } from "@models/dto/administrator";
import type { APIEncode } from "@models/utils";
import type { AdministratorDialogFields } from "./administratorFields";

export async function administratorRowDataToDialogData(
  data: APIEncode<AdministratorListDto>,
): Promise<AdministratorDialogFields> {
  const { accepted, enabled, ...rest } = data;
  return {
    ...rest,
    enabled,
    status: accepted ? "Active" : "Invited",
  };
}
