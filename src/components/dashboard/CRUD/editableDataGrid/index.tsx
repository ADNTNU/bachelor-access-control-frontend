"use client";

import {
  type GridColDef,
  type GridColumnVisibilityModel,
  type GridRowSelectionModel,
  GridToolbar,
  DataGrid,
} from "@mui/x-data-grid";
import assert from "assert";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type TypeSafeColVisibility } from "./cellDefs/common";
import { type FieldValuesWithId } from "@components/dashboard/CRUD/dialogs/common";
import type { PaginationProps } from "@models/pagination";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";

type DynamicGridData = Record<string, unknown> & {
  id: object | string | number;
};
export type EditableDataGridProps<
  T extends DynamicGridData,
  U extends object,
> = {
  columns: GridColDef<T>[];
  initialColumnVisibilityModel?: TypeSafeColVisibility<
    U extends GridColumnVisibilityModel ? U : T
  >;
  rowIdGetter?: (id: T["id"]) => string;
  rowCount: number;
  rows: T[];
  loading: boolean;
  pagination: PaginationProps;
  setPagination: Dispatch<SetStateAction<PaginationProps>>;
};

export default function EditableDataGrid<
  T extends DynamicGridData,
  U extends object,
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

  useEffect(() => {
    let mounted = true;

    if (mounted) {
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
    }

    return () => {
      mounted = false;
    };
  }, [rowIdGetter, rowSelectionModel, rows, setSelectedRows]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (selectedRows.length === 1) {
        if (selectedRows[0]) {
          void rowDataToDialogData(selectedRows[0]).then((data) => {
            setEditDialogData(data);
            setDeleteDialogData(data);
          });
          return;
        }
      }
      setEditDialogData(null);
      setDeleteDialogData(null);
    }

    return () => {
      mounted = false;
    };
  }, [
    rowDataToDialogData,
    selectedRows,
    setDeleteDialogData,
    setEditDialogData,
  ]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      loading={loading}
      checkboxSelection
      disableRowSelectionOnClick
      editMode="row"
      disableColumnFilter
      disableColumnSorting
      onRowDoubleClick={(params) => {
        void rowDataToDialogData(params.row as T).then((data) =>
          setEditDialogData(data),
        );
        openDialog("edit");
      }}
      onCellKeyDown={(params, event) => {
        if (event.key === "Enter") {
          void rowDataToDialogData(params.row as T).then((data) =>
            setEditDialogData(data),
          );
          openDialog("edit");
        }
      }}
      onRowSelectionModelChange={(newRowSelectionModel) =>
        setRowSelectionModel(newRowSelectionModel)
      }
      getRowId={rowIdGetter ? (row) => rowIdGetter(row.id) : undefined}
      rowSelectionModel={rowSelectionModel}
      paginationMode="server"
      filterMode="server"
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
      slots={{
        toolbar: GridToolbar,
      }}
    />
  );
}
