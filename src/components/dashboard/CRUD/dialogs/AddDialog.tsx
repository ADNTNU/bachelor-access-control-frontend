"use client";

import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Stack,
} from "@mui/material";
import {
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import type { WithId } from "@models/utils";
import assert from "assert";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type DialogFields,
  DialogGridItemWrapper,
  type DialogSubmitHandler,
  type FieldValuesWithId,
  gridSizing,
  gridSizingRow,
  type GroupingProps,
} from "./common";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "@/routes";

type AddDialogProps<T extends FieldValues> = {
  fields: DialogFields<T>;
  grouping?: GroupingProps<T>;
  onSubmit: DialogSubmitHandler<T>;
  title: string;
  useFormProps?: UseFormProps<T>;
  defaultValues: DefaultValues<T>;
  companyId: number;
  currentUrl: string;
};

export default function AddDialog<
  T extends FieldValuesWithId,
  U extends WithId,
>(props: AddDialogProps<T>) {
  const {
    fields,
    grouping,
    onSubmit,
    title,
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

  const {
    addDialogOpen: open,
    cancelDialog,
    setAddDialogData,
    error,
    setError: setGlobalError,
    setCommitedChanges,
    setHasDoneChanges,
    currentDialog,
    openAnyDialog,
  } = useAdminDialog<T, U>();

  const {
    register,
    handleSubmit,
    control,
    setError,
    // formState: { errors },
    reset,
    setValue,
  } = useForm<T>({ defaultValues, ...useFormProps });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentDialog) {
      reset();
    }
    if (!open) {
      setGlobalError(null);
    }
  }, [currentDialog, open, reset, setGlobalError]);

  const submitHandler: SubmitHandler<T> = useCallback(
    async (data, event) => {
      if (!token) {
        setGlobalError("Authentication data not found");
        return;
      }

      if (
        await onSubmit(
          data,
          {
            setError,
            setGlobalError,
            cancelDialog,
            setLoading,
            fields,
            companyId,
            token,
            openAnyDialog,
          },
          event,
        )
      ) {
        setCommitedChanges(true);
      }
    },
    [
      token,
      onSubmit,
      setError,
      setGlobalError,
      cancelDialog,
      fields,
      companyId,
      openAnyDialog,
      setCommitedChanges,
    ],
  );

  return (
    <Dialog
      open={open}
      onClose={() => cancelDialog()}
      maxWidth="md"
      fullWidth={Object.keys(fields).length >= 3}
    >
      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {error?.length ? <Alert severity="error">{error}</Alert> : null}
          <Grid2 container spacing={2} key="addDialog-grid-individual">
            {(grouping
              ? Array.from(grouping.ungroupedFields)
              : Object.keys(fields)
            ).map((key) => {
              const typedKey = key;
              const field = fields[typedKey];
              if (!field.addable) return null;
              const keyString = key;
              assert(typeof keyString === "string", "Key must be a string");
              return (
                <DialogGridItemWrapper
                  key={keyString}
                  totalItems={
                    grouping
                      ? Array.from(grouping.ungroupedFields).filter(
                          (tempField) => fields[tempField].addable,
                        ).length
                      : Object.keys(fields).filter(
                          (tempField) => fields[tempField]?.addable,
                        ).length
                  }
                >
                  {field.element({
                    field,
                    setDialogContent: setAddDialogData,
                    setHasDoneChanges,
                    register,
                    control,
                    setValue,
                  })}
                </DialogGridItemWrapper>
              );
            })}
            {grouping?.groups.length ? (
              <Grid2 container size={12} key="addDialog-grid-group">
                {grouping.groups.map((group) => {
                  return (
                    <Grid2
                      size={{
                        ...(group.direction === "column"
                          ? gridSizing
                          : gridSizingRow),
                      }}
                      key={`addDialog-${group.keys.join("-")}-group`}
                    >
                      <Stack direction={group.direction}>
                        {group.keys.map((key) => {
                          const typedKey = key;
                          const field = fields[typedKey];
                          if (!field.addable) return null;
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
                                setDialogContent: setAddDialogData,
                                setHasDoneChanges,
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              cancelDialog();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
