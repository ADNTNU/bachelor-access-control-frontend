"use client";

import type { APIEncode } from "@models/utils";
import useSWR from "swr";
import useDebounce from "@hooks/useDebounce";
import apiRoutes from "@/apiRoutes";
import { type TypeSafeColDef } from "./common";
import type {
  AdministratorListDto,
  ListAdministratorRequestBody,
  ListAdministratorResponse,
} from "@models/dto/administrator";
import { paginatedFetcher } from "@/utils/fetcher";

type AggregateFields = {
  status: unknown;
};

export const columns: TypeSafeColDef<
  APIEncode<AdministratorListDto>,
  AggregateFields
>[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    description: "Administrator ID",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    description: "Status",
    valueGetter: (_, row) => {
      const { accepted, enabled } = row;
      if (accepted && enabled) {
        return "Enabled";
      } else if (accepted && !enabled) {
        return "Disabled";
      } else if (!accepted && enabled) {
        return "Invited";
      }
    },
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 100,
    description: "Administrator Name",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    minWidth: 100,
    description: "Administrator Email",
  },
  {
    field: "username",
    headerName: "Username",
    flex: 1,
    minWidth: 100,
    description: "Administrator Username",
  },
];

export function useRowsGetter(
  props: ListAdministratorRequestBody,
  token?: string,
  debounce = 1000,
) {
  const debouncedPaginationPage = useDebounce<
    ListAdministratorRequestBody["page"]
  >({
    value: props.page,
    delay: debounce,
  });
  const debouncedPaginationSize = useDebounce<
    ListAdministratorRequestBody["size"]
  >({
    value: props.size,
    delay: debounce,
  });
  const companyId = props.companyId;

  const swrObj = useSWR<ListAdministratorResponse>(
    {
      url: apiRoutes.crud.administrator.list,
      page: debouncedPaginationPage,
      size: debouncedPaginationSize,
      companyId,
      // filters: debouncedFilters,
      // sort: debouncedSort,
    },
    ({
      url,
      page,
      size,
      companyId,
    }: { url: string } & ListAdministratorRequestBody) => {
      if (!token) {
        throw new Error("No token found");
      }
      return paginatedFetcher<
        ListAdministratorResponse,
        ListAdministratorRequestBody
      >({
        url,
        body: { page, size, companyId },
        token,
      });
    },
    { revalidateOnFocus: false },
  );

  return swrObj;
}

export const initialColumnVisibilityModel: Record<
  (typeof columns)[number]["field"],
  boolean
> = {
  id: true,
  name: true,
  status: true,
  accepted: true,
  enabled: true,
  username: true,
  email: false,
};
