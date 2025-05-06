"use client";

import { type AdministratorDialogFields } from "@components/dashboard/CRUD/administrator/administratorFields";
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
} from "@components/dashboard/CRUD/editableDataGrid/cellDefs/administrator";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import EditableDataGrid from "@components/dashboard/CRUD/editableDataGrid/EditableDataGrid";
import type { AdministratorListDto } from "@models/dto/administrator";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { routes } from "@/routes";

type AdministratorDataGridProps = {
  currentUrl: string;
};

export default function AdministratorDataGrid(
  props: AdministratorDataGridProps,
) {
  const { currentUrl } = props;
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 0,
    limit: 25,
  });
  // const [sort, setSort] = useState<UserSortDTO[] | undefined>(undefined);
  const [rows, setRows] = useState<APIEncode<AdministratorListDto>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const session = useSession();

  const token = useMemo(() => {
    if (session.status === "authenticated") {
      return session.data?.accessToken;
    }
    return undefined;
  }, [session]);

  if (!token && session.status !== "loading") {
    console.warn("No token found, redirecting to unauthorized page3");
    redirect(routes.error.unauthorized(currentUrl));
  }

  const { companyId } = useParams<{ companyId: string }>();

  const memoizedPagination = useMemo(() => {
    return {
      limit: pagination.limit,
      page: pagination.page + 1,
    };
  }, [pagination]);

  const { setRowMutator } = useAdminDialog<
    AdministratorDialogFields,
    APIEncode<AdministratorListDto>
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
        <AddButton label="Invite" />
        <EditButton />
        <DeleteButton />
      </Stack>
      <EditableDataGrid<
        APIEncode<AdministratorListDto>,
        (typeof columns)[number],
        AdministratorDialogFields
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
