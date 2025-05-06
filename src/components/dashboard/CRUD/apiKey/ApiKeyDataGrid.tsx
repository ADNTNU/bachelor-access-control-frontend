"use client";

import { type ApiKeyDialogFields } from "@components/dashboard/CRUD/apiKey/apiKeyFields";
import { type PaginationProps } from "@models/pagination";
import { type APIEncode } from "@models/utils";
import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AddButton from "@components/dashboard/CRUD/AddButton";
import EditButton from "@components/dashboard/CRUD/EditButton";
import DeleteButton from "@components/dashboard/CRUD/DeleteButton";
import {
  columns,
  initialColumnVisibilityModel,
  useRowsGetter,
} from "@components/dashboard/CRUD/editableDataGrid/cellDefs/apiKey";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import EditableDataGrid from "@components/dashboard/CRUD/editableDataGrid/EditableDataGrid";
import type { ApiKeyListDto } from "@models/dto/apiKey";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { routes } from "@/routes";

type ApiKeyDataGridProps = {
  currentUrl: string;
};

export default function ApiKeyDataGrid(props: ApiKeyDataGridProps) {
  const { currentUrl } = props;
  const session = useSession();

  const token = useMemo(() => {
    if (session.status === "authenticated") {
      return session.data?.accessToken;
    }
    return undefined;
  }, [session]);

  if (!token && session.status !== "loading") {
    console.warn("No token found, redirecting to unauthorized page5");
    redirect(routes.error.unauthorized(currentUrl));
  }

  const [pagination, setPagination] = useState<PaginationProps>({
    page: 0,
    limit: 25,
  });
  // const [sort, setSort] = useState<UserSortDTO[] | undefined>(undefined);
  const [rows, setRows] = useState<APIEncode<ApiKeyListDto>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { companyId } = useParams<{ companyId: string }>();

  const memoizedPagination = useMemo(() => {
    return {
      limit: pagination.limit,
      page: pagination.page + 1,
    };
  }, [pagination]);

  const { setRowMutator } = useAdminDialog<
    ApiKeyDialogFields,
    APIEncode<ApiKeyListDto>
  >();

  const {
    data: rowsData,
    mutate,
    isLoading,
  } = useRowsGetter(
    {
      companyId: Number(companyId),
      page: memoizedPagination.page,
      size: memoizedPagination.limit,
    },
    token,
    500,
  );

  useEffect(() => {
    setRowMutator(() => mutate);
  }, [mutate, setRowMutator]);

  useEffect(() => {
    if (!isLoading) {
      const rowsValue = rowsData?.data ?? [];
      const rowCountValue = rowsData?.totalElements ?? 0;
      setRows(rowsValue);
      setRowCount(rowCountValue);
      setLoading(false);
    }
  }, [isLoading, rowsData]);

  return (
    <Stack sx={{ minHeight: 400, width: "100%" }} gap={2}>
      <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
        <AddButton label="Create" />
        <EditButton />
        <DeleteButton />
      </Stack>
      <EditableDataGrid<
        APIEncode<ApiKeyListDto>,
        (typeof columns)[number],
        ApiKeyDialogFields
      >
        columns={columns}
        initialColumnVisibilityModel={initialColumnVisibilityModel}
        rows={rows}
        rowCount={rowCount}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Stack>
  );
}
