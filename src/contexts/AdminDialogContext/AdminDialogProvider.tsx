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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [hasDoneChanges, setHasDoneChanges] = useState<boolean>(false);
  const [actionOnConfirm, setActionOnConfirm] = useState<
    (() => void) | undefined
  >(undefined);

  const [rowMutator, setRowMutator] = useState<
    KeyedMutator<AdminCrudListResponse<U>> | undefined
  >(undefined);
  const [commitedChanges, setCommitedChanges] = useState<boolean>(true);

  const [currentDialog, setCurrentDialog] = useState<string | null>(null);
  const [prevDialog, setPrevDialog] = useState<string | null>(null);

  const [customDialogsOpen, setCustomDialogsOpen] = useState<
    Record<string, boolean>
  >({});
  const [customDialogsData, setCustomDialogsData] = useState<
    Record<string, object>
  >({});

  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearAllCustomDialogsData = useCallback(() => {
    setCustomDialogsData({});
  }, [setCustomDialogsData]);

  const closeAllDialogs = useCallback(() => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setCustomDialogsOpen({});
  }, [
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setCustomDialogsOpen,
  ]);

  const closeCurrentDialog = useCallback(() => {
    if (currentDialog === "add") {
      setAddDialogOpen(false);
    } else if (currentDialog === "edit") {
      setEditDialogOpen(false);
    } else if (currentDialog === "delete") {
      setDeleteDialogOpen(false);
    } else if (currentDialog) {
      setCustomDialogsOpen((prev) => ({ ...prev, [currentDialog]: false }));
    }
    if (prevDialog) {
      setCurrentDialog(prevDialog);
    }
    setPrevDialog(null);
  }, [
    currentDialog,
    prevDialog,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
  ]);

  const confirmDiscardChanges = useCallback(
    (action: () => void) => {
      if (hasDoneChanges) {
        setActionOnConfirm(() => action);
        setConfirmDialogOpen(true);
        closeAllDialogs();
      } else {
        action();
      }
    },
    [closeAllDialogs, hasDoneChanges],
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
        setCustomDialogsOpen({});
      } else if (dialog === "edit") {
        setAddDialogOpen(false);
        setEditDialogOpen(true);
        setDeleteDialogOpen(false);
        setCustomDialogsOpen({});
      } else if (dialog === "delete") {
        setAddDialogOpen(false);
        setEditDialogOpen(false);
        setDeleteDialogOpen(true);
        setCustomDialogsOpen({});
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

  const openAnyDialog = useCallback(
    (dialogName: string, data?: object, force?: boolean) => {
      if (["add", "edit", "delete"].includes(dialogName)) {
        openDialog(dialogName as "add" | "edit" | "delete", force);
        return;
      }

      if (!force) {
        confirmDiscardChanges(() => openAnyDialog(dialogName, data, true));
        return;
      }

      setHasDoneChanges(false);

      if (currentDialog) {
        setPrevDialog(currentDialog);
      }
      setCurrentDialog(dialogName);
      closeAllDialogs();

      setCustomDialogsOpen((prev) => ({ ...prev, [dialogName]: true }));
      if (typeof data === "object") {
        setCustomDialogsData((prev) => ({ ...prev, [dialogName]: data }));
      }
    },
    [closeAllDialogs, confirmDiscardChanges, currentDialog, openDialog],
  );

  const closeDialogsAndClearHistory = useCallback(() => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setCurrentDialog(null);
    setPrevDialog(null);
  }, [setAddDialogOpen, setEditDialogOpen, setDeleteDialogOpen]);

  const cancelDialog = useCallback(
    (force?: boolean) => {
      if (!force) {
        confirmDiscardChanges(() => cancelDialog(true));
        return;
      }

      setHasDoneChanges(false);

      if (prevDialog) {
        openAnyDialog(prevDialog);
      } else {
        closeDialogsAndClearHistory();
      }
      setPrevDialog(null);
    },
    [
      prevDialog,
      confirmDiscardChanges,
      openAnyDialog,
      closeDialogsAndClearHistory,
    ],
  );

  const cancelConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setActionOnConfirm(undefined);

    if (currentDialog === "add") {
      setAddDialogOpen(true);
    } else if (currentDialog === "edit") {
      setEditDialogOpen(true);
    } else if (currentDialog === "delete") {
      setDeleteDialogOpen(true);
    } else if (currentDialog) {
      setCustomDialogsOpen((prev) => ({ ...prev, [currentDialog]: true }));
    }
  }, [currentDialog, setAddDialogOpen, setEditDialogOpen, setDeleteDialogOpen]);

  const confirmConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    if (actionOnConfirm) {
      actionOnConfirm();
      setActionOnConfirm(undefined);
    }
  }, [setConfirmDialogOpen, actionOnConfirm, setActionOnConfirm]);

  const clearStatesOnAllDialogsClosed = useCallback(() => {
    if (isMountedRef.current && !currentDialog) {
      setPrevDialog(null);
      setHasDoneChanges(false);
      if (commitedChanges && typeof rowMutator === "function") {
        void rowMutator();
        setCommitedChanges(false);
      }
      setAddDialogData(null);
      setEditDialogData(null);
      setDeleteDialogData(null);
      clearAllCustomDialogsData();
    }
  }, [clearAllCustomDialogsData, commitedChanges, currentDialog, rowMutator]);

  useEffect(clearStatesOnAllDialogsClosed, [clearStatesOnAllDialogsClosed]);

  useEffect(() => {
    if (
      !addDialogOpen &&
      !editDialogOpen &&
      !deleteDialogOpen &&
      !confirmDialogOpen &&
      !Object.values(customDialogsOpen).some((open) => open)
    ) {
      setCurrentDialog(null);
    }
  }, [
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    confirmDialogOpen,
    customDialogsOpen,
  ]);

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
    customDialogsOpen,
    customDialogsData,
    setHasDoneChanges,
    selectedRows,
    setSelectedRows,
    error,
    setError,
    currentDialog,
    openDialog,
    openAnyDialog,
    cancelDialog,
    closeCurrentDialog,
    rowMutator,
    setRowMutator,
    rowDataToDialogData: rowDataToDialogData,
    setCommitedChanges,
    commitedChanges,
    confirmDialogOpen,
    cancelConfirmDialog,
    confirmConfirmDialog,
  } satisfies AdminDialogsContextType<T, U>;

  return (
    <AdminDialogsContext.Provider value={adminDialogsValue}>
      {children}
    </AdminDialogsContext.Provider>
  );
}
