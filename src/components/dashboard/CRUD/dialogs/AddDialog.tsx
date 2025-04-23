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
  useForm,
  type UseFormProps,
} from "react-hook-form";
import type { WithId } from "@models/utils";
import assert from "assert";
import { useEffect, useState } from "react";
import {
  type DialogFields,
  DialogGridItemWrapper,
  type DialogSubmitHandler,
  type FieldValuesWithId,
  gridSizing,
  gridSizingRow,
  type GroupingProps,
} from "./common";

type AddDialogProps<T extends FieldValues> = {
  fields: DialogFields<T>;
  grouping?: GroupingProps<T>;
  onSubmit: DialogSubmitHandler<T>;
  title: string;
  useFormProps?: UseFormProps<T>;
  defaultValues: DefaultValues<T>;
  companyId: number;
  token: string;
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
    token,
  } = props;

  const {
    addDialogOpen: open,
    cancelDialog,
    setAddDialogData,
    error,
    setError: setGlobalError,
    setCommitedChanges,
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
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={() => cancelDialog()}
      maxWidth="md"
      fullWidth={Object.keys(fields).length >= 3}
    >
      <form
        onSubmit={handleSubmit(async (submitData, submitEvent) => {
          if (
            await onSubmit(
              submitData,
              {
                setError,
                setGlobalError,
                cancelDialog,
                setLoading,
                fields,
                companyId,
                token,
              },
              submitEvent,
            )
          ) {
            setCommitedChanges(true);
          }
        })}
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
            Avbryt
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            Lagre
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
