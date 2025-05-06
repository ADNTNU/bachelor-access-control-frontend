"use client";

import {
  type GridColDef,
  type GridRowSelectionModel,
  DataGrid,
} from "@mui/x-data-grid";
import assert from "assert";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type FieldValuesWithId } from "@components/dashboard/CRUD/dialogs/common";
import type { PaginationProps } from "@models/pagination";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import { NoSsr } from "@mui/material";

type DynamicGridData = Record<string, unknown> & {
  id: object | string | number;
};

type EditableDataGridProps<
  T extends DynamicGridData,
  U extends GridColDef<T>,
> = {
  columns: GridColDef<T>[];
  initialColumnVisibilityModel?: Record<U["field"], boolean>;
  rowIdGetter?: (id: T["id"]) => string;
  rowCount: number;
  rows: T[];
  loading: boolean;
  pagination: PaginationProps;
  setPagination: Dispatch<SetStateAction<PaginationProps>>;
};

export default function EditableDataGrid<
  T extends DynamicGridData,
  U extends GridColDef<T>,
  P extends FieldValuesWithId,
>(props: EditableDataGridProps<T, U>) {
  const {
    columns,
    initialColumnVisibilityModel,
    rowIdGetter,
    loading,
    rowCount,
    rows,
    pagination,
    setPagination,
  } = props;

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const paginationModel = useMemo(() => {
    return {
      pageSize: pagination.limit,
      page: pagination.page,
    };
  }, [pagination]);

  const {
    openDialog,
    setEditDialogData,
    setDeleteDialogData,
    setSelectedRows,
    selectedRows,
    rowDataToDialogData,
  } = useAdminDialog<P, T>();

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;

    setSelectedRows(
      rows?.filter((row) => {
        let rowId: string | number | undefined;
        if (rowIdGetter) {
          rowId = rowIdGetter(row.id);
        } else {
          assert(
            typeof row.id === "string" || typeof row.id === "number",
            "Row id must be a string or number without rowIdGetter",
          );
          rowId = row.id;
        }
        if (rowSelectionModel.type === "include") {
          return rowSelectionModel.ids.has(rowId);
        } else {
          return !rowSelectionModel.ids.has(rowId);
        }
      }),
    );
  }, [rowIdGetter, rowSelectionModel, rows, setSelectedRows]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (selectedRows.length === 1 && selectedRows[0]) {
      void rowDataToDialogData(selectedRows[0]).then((data) => {
        if (!isMountedRef.current) return;
        setEditDialogData(data);
        setDeleteDialogData(data);
      });
    } else {
      if (!isMountedRef.current) return;
      setEditDialogData(null);
      setDeleteDialogData(null);
    }
  }, [
    rowDataToDialogData,
    selectedRows,
    setDeleteDialogData,
    setEditDialogData,
  ]);

  return (
    <NoSsr>
      <DataGrid
        columns={columns}
        rows={rows}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        editMode="row"
        disableColumnFilter
        disableColumnSorting
        onRowDoubleClick={async (params) => {
          if (!isMountedRef.current) return;
          const data = await rowDataToDialogData(params.row as T);
          if (!isMountedRef.current) return;
          setEditDialogData(data);
          openDialog("edit");
        }}
        onCellKeyDown={async (params, event) => {
          if (event.key === "Enter") {
            if (!isMountedRef.current) return;
            const data = await rowDataToDialogData(params.row as T);
            if (!isMountedRef.current) return;
            setEditDialogData(data);
            openDialog("edit");
          }
        }}
        onRowSelectionModelChange={(newRowSelectionModel) =>
          setRowSelectionModel(newRowSelectionModel)
        }
        getRowId={rowIdGetter ? (row) => rowIdGetter(row.id) : undefined}
        rowSelectionModel={rowSelectionModel}
        paginationMode="server"
        rowCount={rowCount}
        // autoPageSize
        onPaginationModelChange={(_paginationModel) => {
          setPagination({
            page: _paginationModel.page,
            limit: _paginationModel.pageSize,
          });
        }}
        paginationModel={paginationModel}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...initialColumnVisibilityModel,
            },
          },
        }}
        showToolbar
      />
    </NoSsr>
  );
}
