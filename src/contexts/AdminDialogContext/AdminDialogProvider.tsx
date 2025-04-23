"use client";

import {
  AdminDialogsContext,
  type AdminDialogsContextType,
} from "./AdminDialogContext";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyedMutator } from "swr";
import type { AdminCrudListResponse } from "@models/backend/crud";
import type { FieldValuesWithId } from "@components/dashboard/CRUD/dialogs/common";
import type { WithId } from "@models/utils";

export default function AdminDialogsProvider<
  T extends FieldValuesWithId,
  U extends WithId /* , F */,
>({
  children,
  rowDataToDialogData,
}: {
  children: ReactNode;
  rowDataToDialogData: (rowData: U) => Promise<T>;
}) {
  const addDialogState = useState<boolean>(false);
  const editDialogState = useState<boolean>(false);
  const deleteDialogState = useState<boolean>(false);

  const [addDialogOpen, setAddDialogOpen] = addDialogState;
  const [editDialogOpen, setEditDialogOpen] = editDialogState;
  const [deleteDialogOpen, setDeleteDialogOpen] = deleteDialogState;
  const [addDialogData, setAddDialogData] = useState<T | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<T | null>(null);
  const [editDialogData, setEditDialogData] = useState<T | null>(null);
  const [selectedRows, setSelectedRows] = useState<U[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasDoneChanges, setHasDoneChanges] = useState<boolean>(false);
  const [_actionOnConfirm, setActionOnConfirm] = useState<
    (() => void) | undefined
  >(undefined);
  const [rowMutator, setRowMutator] = useState<
    KeyedMutator<AdminCrudListResponse<U>> | undefined
  >(undefined);
  const [commitedChanges, setCommitedChanges] = useState<boolean>(false);

  const [currentDialog, setCurrentDialog] = useState<
    "add" | "delete" | "edit" | null
  >(null);
  const [prevdialog, setPrevDialog] = useState<
    "add" | "delete" | "edit" | null
  >(null);
  const hasMountedRef = useRef<boolean>(false);

  const confirmDiscardChanges = useCallback(
    (action: () => void) => {
      if (hasDoneChanges) {
        setActionOnConfirm(() => action);
      } else {
        action();
      }
    },
    [hasDoneChanges],
  );

  const openDialog = useCallback(
    (dialog: "add" | "delete" | "edit", force?: boolean) => {
      if (!force) {
        confirmDiscardChanges(() => openDialog(dialog, true));
        return;
      }
      setHasDoneChanges(false);

      if (currentDialog) {
        setPrevDialog(currentDialog);
      }
      setCurrentDialog(dialog);
      if (dialog === "add") {
        setAddDialogOpen(true);
        setEditDialogOpen(false);
        setDeleteDialogOpen(false);
      } else if (dialog === "edit") {
        setAddDialogOpen(false);
        setEditDialogOpen(true);
        setDeleteDialogOpen(false);
      } else {
        setAddDialogOpen(false);
        setEditDialogOpen(false);
        setDeleteDialogOpen(true);
      }
    },
    [
      confirmDiscardChanges,
      currentDialog,
      setAddDialogOpen,
      setDeleteDialogOpen,
      setEditDialogOpen,
    ],
  );

  const cancelDialog = useCallback(
    (force?: boolean) => {
      if (!force) {
        confirmDiscardChanges(() => cancelDialog(true));
        return;
      }

      setHasDoneChanges(false);

      if (prevdialog) {
        openDialog(prevdialog);
      } else {
        setAddDialogOpen(false);
        setEditDialogOpen(false);
        setDeleteDialogOpen(false);
        setCurrentDialog(null);
      }
      setPrevDialog(null);
    },
    [
      prevdialog,
      confirmDiscardChanges,
      openDialog,
      setAddDialogOpen,
      setEditDialogOpen,
      setDeleteDialogOpen,
    ],
  );

  const closeDialog = useCallback(() => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setCurrentDialog(null);
    setPrevDialog(null);
  }, [setAddDialogOpen, setEditDialogOpen, setDeleteDialogOpen]);

  const clearStatesOnDialogClose = useCallback(() => {
    if (
      hasMountedRef.current &&
      !addDialogOpen &&
      !editDialogOpen &&
      !deleteDialogOpen
    ) {
      setPrevDialog(null);
      if (commitedChanges && typeof rowMutator === "function") {
        void rowMutator();
        setCommitedChanges(false);
      }
      setAddDialogData(null);
      setEditDialogData(null);
      setDeleteDialogData(null);
    }
    setHasDoneChanges(false);
    hasMountedRef.current = true;
  }, [
    addDialogOpen,
    commitedChanges,
    deleteDialogOpen,
    editDialogOpen,
    rowMutator,
  ]);

  useEffect(clearStatesOnDialogClose, [clearStatesOnDialogClose]);

  const adminDialogsValue = {
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    addDialogData,
    setAddDialogData,
    editDialogData,
    setEditDialogData,
    deleteDialogData,
    setDeleteDialogData,
    selectedRows,
    setSelectedRows,
    error,
    setError,
    openDialog,
    cancelDialog,
    closeDialog,
    rowMutator,
    setRowMutator,
    rowDataToDialogData: rowDataToDialogData,
    setCommitedChanges,
    commitedChanges,
  } satisfies AdminDialogsContextType<T, U>;

  return (
    <AdminDialogsContext.Provider value={adminDialogsValue}>
      {children}
    </AdminDialogsContext.Provider>
  );
}
