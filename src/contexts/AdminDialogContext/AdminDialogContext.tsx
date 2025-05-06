"use client";

import { type FieldValuesWithId } from "@components/dashboard/CRUD/dialogs/common";
import { type AdminCrudListResponse } from "@models/backend/crud";
import { type WithId } from "@models/utils";
import { type Dispatch, type SetStateAction, createContext } from "react";
import { type KeyedMutator } from "swr";

export type AdminDialogsContextType<
  T extends FieldValuesWithId,
  U extends WithId /* , F */,
> = {
  addDialogOpen: boolean;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  addDialogData: T | null;
  setAddDialogData: Dispatch<SetStateAction<T | null>>;
  editDialogData: T | null;
  setEditDialogData: Dispatch<SetStateAction<T | null>>;
  deleteDialogData: T | null;
  setDeleteDialogData: Dispatch<SetStateAction<T | null>>;
  customDialogsOpen: Record<string, boolean>;
  customDialogsData: Record<string, object>;
  setHasDoneChanges: Dispatch<SetStateAction<boolean>>;
  selectedRows: U[];
  setSelectedRows: Dispatch<SetStateAction<U[]>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  currentDialog: string | null;
  openDialog: (dialog: "add" | "delete" | "edit") => void;
  openAnyDialog: (dialog: string, data: object, force?: boolean) => void;
  cancelDialog: (force?: boolean) => void;
  closeCurrentDialog: () => void;
  rowMutator: KeyedMutator<AdminCrudListResponse<U>> | undefined;
  setRowMutator: Dispatch<
    SetStateAction<KeyedMutator<AdminCrudListResponse<U>> | undefined>
  >;
  rowDataToDialogData: (rowData: U) => Promise<T>;
  setCommitedChanges: Dispatch<SetStateAction<boolean>>;
  commitedChanges: boolean;
  confirmDialogOpen: boolean;
  cancelConfirmDialog: () => void;
  confirmConfirmDialog: () => void;
};

export const AdminDialogsContext = createContext({});

// const AdminDialogsContext = createContext<
//   AdminDialogsContextType<FieldValuesWithId, WithId> | undefined
// >(undefined);

// export default AdminDialogsContext;
