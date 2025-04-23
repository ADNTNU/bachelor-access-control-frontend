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
import EditableDataGrid from "@components/dashboard/CRUD/editableDataGrid";
import type { AdministratorListDto } from "@models/dto/administrator";
import { useParams } from "next/navigation";

type AdministratorDataGridProps = {
  token: string;
};

export default function AdministratorDataGrid(
  props: AdministratorDataGridProps,
) {
  const { token } = props;
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 0,
    limit: 25,
  });
  // const [sort, setSort] = useState<UserSortDTO[] | undefined>(undefined);
  const [rows, setRows] = useState<APIEncode<AdministratorListDto>[]>([]);
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
        typeof initialColumnVisibilityModel,
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
