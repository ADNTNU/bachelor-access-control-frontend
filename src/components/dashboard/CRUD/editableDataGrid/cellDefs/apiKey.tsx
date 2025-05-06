"use client";

import type { APIEncode } from "@models/utils";
import useSWR from "swr";
import useDebounce from "@hooks/useDebounce";
import apiRoutes from "@/apiRoutes";
import { type TypeSafeColDef } from "./common";
import type {
  ApiKeyListDto,
  ListApiKeyRequestBody,
  ListApiKeyResponse,
} from "@models/dto/apiKey";
import { paginatedFetcher } from "@/utils/fetcher";

type AggregateFields = object;

export const columns: TypeSafeColDef<
  APIEncode<ApiKeyListDto>,
  AggregateFields
>[] = [
  { field: "id", headerName: "ID", flex: 1, description: "ApiKey ID" },
  {
    field: "enabled",
    headerName: "Enabled",
    flex: 1,
    description: "Enabled",
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    description: "Name",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    description: "Description",
  },
  {
    field: "clientId",
    headerName: "Client ID",
    flex: 1,
    description: "Client ID",
  },
  {
    field: "scopes",
    headerName: "Scopes",
    flex: 1,
    description: "Scopes",
    valueGetter: (_, row) => {
      const { scopes } = row;
      return scopes.join(", ");
    },
  },
];

export function useRowsGetter(
  props: ListApiKeyRequestBody,
  token?: string,
  debounce = 1000,
) {
  const debouncedPaginationPage = useDebounce<ListApiKeyRequestBody["page"]>({
    value: props.page,
    delay: debounce,
  });
  const debouncedPaginationSize = useDebounce<ListApiKeyRequestBody["size"]>({
    value: props.size,
    delay: debounce,
  });
  const companyId = props.companyId;

  const swrObj = useSWR<ListApiKeyResponse>(
    {
      url: apiRoutes.crud.apiKey.list,
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
    }: { url: string } & ListApiKeyRequestBody) => {
      if (!token) {
        throw new Error("No token found");
      }
      return paginatedFetcher<ListApiKeyResponse, ListApiKeyRequestBody>({
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
  enabled: true,
  name: true,
  description: true,
  clientId: true,
  scopes: true,
};
