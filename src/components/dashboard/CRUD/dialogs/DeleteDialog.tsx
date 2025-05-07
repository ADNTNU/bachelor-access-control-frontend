"use client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { WithId } from "@models/utils";
import {
  type DefaultValues,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import assert from "assert";
import {
  type DialogDeleteHandler,
  type DialogFields,
  DialogGridItemWrapper,
  type FieldValuesWithId,
  gridSizing,
  gridSizingRow,
  type GroupingProps,
} from "./common";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "@/routes";

type DeleteDialogProps<T extends FieldValuesWithId> = {
  fields: DialogFields<T>;
  grouping?: GroupingProps<T>;
  onSubmit: DialogDeleteHandler<T>;
  singularTitle: string;
  pluralTitle: string;
  useFormProps?: UseFormProps<T>;
  defaultValues: DefaultValues<T>;
  companyId: number;
  currentUrl: string;
};

export default function DeleteDialog<
  T extends FieldValuesWithId,
  U extends WithId,
>(props: DeleteDialogProps<T>) {
  const {
    fields,
    grouping,
    onSubmit,
    pluralTitle,
    singularTitle,
    useFormProps,
    defaultValues,
    companyId,
    currentUrl,
  } = props;

  const session = useSession();

  const token = useMemo(() => {
    if (session.status === "authenticated") {
      return session.data?.accessToken;
    }
    return undefined;
  }, [session]);

  if (!token && session.status !== "loading") {
    console.warn("No token found, redirecting to unauthorized page");
    redirect(routes.error.unauthorized(currentUrl));
  }

  const [prevData, setPrevData] = useState<T | null>(null);
  const [initialDialogData, setInitialDialogData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    deleteDialogOpen: open,
    deleteDialogData: dialogData,
    selectedRows,
    setError: setGlobalError,
    error,
    cancelDialog,
    closeCurrentDialog,
    setDeleteDialogData,
    setCommitedChanges,
  } = useAdminDialog<T, U>();

  const { register, control, reset, setValue } = useForm<T>({
    defaultValues,
    values: initialDialogData ?? undefined,
    ...useFormProps,
  });

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let ids: T["id"][] = [];

    if (!token) {
      setGlobalError("Authentication data not found");
      return;
    }

    if (dialogData) {
      ids = [dialogData.id];
    } else if (selectedRows.length > 0) {
      ids = selectedRows.map((row) => row.id);
    } else {
      setGlobalError("Ingen element valt");
      return;
    }

    setGlobalError(null);
    const res = await onSubmit({
      identifiers: ids,
      setGlobalError,
      fields,
      companyId,
      token,
    });

    if (res) {
      setCommitedChanges(true);
      closeCurrentDialog();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      reset();
      setGlobalError(null);
    }
  }, [open, reset, setGlobalError]);

  useEffect(() => {
    if (prevData === null && dialogData) {
      setInitialDialogData(dialogData);
    }
    setPrevData(dialogData);
  }, [dialogData, prevData, setDeleteDialogData]);

  useEffect(() => {
    if (open && !dialogData && selectedRows.length === 0) {
      setGlobalError("Ingen element valt");
    }
  }, [open, dialogData, selectedRows.length, setGlobalError]);

  return (
    <Dialog
      open={open}
      onClose={() => cancelDialog()}
      maxWidth="md"
      fullWidth={Object.keys(fields).length >= 3}
    >
      <form
        onSubmit={handleDelete}
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ backgroundColor: (theme) => theme.palette.error.light }}>
          <DialogTitle
            sx={{
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.error.light),
            }}
          >
            {!dialogData && selectedRows.length > 0
              ? pluralTitle
              : singularTitle}
          </DialogTitle>
        </Box>
        <DialogContent>
          {error?.length ? <Alert severity="error">{error}</Alert> : null}
          {dialogData ? (
            <Grid2 container spacing={2}>
              {(grouping
                ? Array.from(grouping.ungroupedFields)
                : Object.keys(fields)
              ).map((key) => {
                const typedKey = key;
                const field = fields[typedKey];
                if (field.hiddenInDelete) return null;
                const keyString = key;
                assert(typeof keyString === "string", "Key must be a string");
                return (
                  <DialogGridItemWrapper
                    key={keyString}
                    totalItems={
                      grouping
                        ? Array.from(grouping.ungroupedFields).length
                        : Object.keys(fields).length
                    }
                  >
                    {field.element({
                      field,
                      // value: (dialogData ? dialogData[typedKey] : undefined) as
                      //   | T[keyof T]
                      //   | undefined,
                      state: {
                        isDelete: true,
                      },
                      setDialogContent: setDeleteDialogData,
                      // eslint-disable-next-line @typescript-eslint/no-empty-function
                      setHasDoneChanges: () => {},
                      register,
                      control,
                      setValue,
                    })}
                  </DialogGridItemWrapper>
                );
              })}
              {grouping?.groups.length ? (
                <Grid2 container size={12}>
                  {grouping.groups.map((group) => {
                    return (
                      <Grid2
                        size={{
                          ...(group.direction === "column"
                            ? gridSizing
                            : gridSizingRow),
                        }}
                        key={`deleteDialog-${group.keys.join("-")}-group`}
                      >
                        <Stack direction={group.direction}>
                          {group.keys.map((key) => {
                            const typedKey = key;
                            const field = fields[typedKey];
                            if (!field.editable && field.hiddenInEdit)
                              return null;
                            const keyString = key;
                            assert(
                              typeof keyString === "string",
                              "Key must be a string",
                            );
                            return (
                              <DialogGridItemWrapper
                                key={keyString}
                                grid={false}
                                totalItems={group.keys.length}
                              >
                                {field.element({
                                  field,
                                  // value: (dialogData ? dialogData[typedKey] : undefined) as
                                  //   | T[keyof T]
                                  //   | undefined,
                                  state: {
                                    isDelete: true,
                                  },
                                  setDialogContent: setDeleteDialogData,
                                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                                  setHasDoneChanges: () => {},
                                  grid: false,
                                  register,
                                  control,
                                  setValue,
                                })}
                              </DialogGridItemWrapper>
                            );
                          })}
                        </Stack>
                      </Grid2>
                    );
                  })}
                </Grid2>
              ) : null}
            </Grid2>
          ) : null}
          {!dialogData && selectedRows.length > 0 ? (
            <Typography variant="body1">
              Delete {selectedRows.length} selected{" "}
              {selectedRows.length === 1 ? "row" : "rows"}?
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => cancelDialog()}
            disabled={loading}
          >
            No, cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            type="submit"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
