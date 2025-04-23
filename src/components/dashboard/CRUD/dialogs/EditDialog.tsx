"use client";

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
import { type ReactNode, useEffect, useState } from "react";
import { type WithId } from "@models/utils";
import {
  type DefaultValues,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import assert from "assert";
import {
  type DialogFields,
  DialogGridItemWrapper,
  type DialogSubmitHandler,
  type FieldValuesWithId,
  gridSizing,
  gridSizingRow,
  type GroupingProps,
} from "./common";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";

type EditDialogProps<T extends FieldValuesWithId> = {
  fields: DialogFields<T>;
  grouping?: GroupingProps<T>;
  onSubmit: DialogSubmitHandler<T>;
  title: string;
  useFormProps?: UseFormProps<T>;
  defaultValues: DefaultValues<T>;
  bottomElement?: ReactNode;
  companyId: number;
  token: string;
};

export default function EditDialog<
  T extends FieldValuesWithId,
  U extends WithId,
>(props: EditDialogProps<T>) {
  const {
    fields,
    grouping,
    onSubmit,
    title,
    useFormProps,
    defaultValues,
    bottomElement,
    companyId,
    token,
  } = props;

  const {
    editDialogOpen: open,
    editDialogData: dialogData,
    setDeleteDialogData,
    error,
    setError: setGlobalError,
    openDialog,
    cancelDialog,
    setEditDialogData,
    setCommitedChanges,
  } = useAdminDialog<T, U>();

  const [prevData, setPrevData] = useState<T | null>(null);
  const [initialDialogData, setInitialDialogData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, setError, reset, setValue } =
    useForm<T>({
      defaultValues,
      values: initialDialogData ?? undefined,
      ...useFormProps,
    });

  useEffect(() => {
    if (!open) {
      reset();
      setLoading(false);
    }
  }, [open, reset]);

  useEffect(() => {
    if (prevData === null && dialogData) {
      setDeleteDialogData(dialogData);
      setInitialDialogData(dialogData);
    }
    setPrevData(dialogData);
  }, [dialogData, prevData, setDeleteDialogData]);

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
        <DialogContent sx={{ height: "100%", overflowY: "auto" }}>
          {error?.length ? <Alert severity="error">{error}</Alert> : null}
          {/* <Box sx={{ overflowY: 'auto', height: '100%' }}> */}
          <Grid2 container spacing={2}>
            {(grouping
              ? Array.from(grouping.ungroupedFields)
              : Object.keys(fields)
            ).map((key) => {
              const field = fields[key];
              if (!field.editable && field.hiddenInEdit) return null;
              const keyString = key;
              assert(typeof keyString === "string", "Key must be a string");
              return (
                <DialogGridItemWrapper
                  key={keyString}
                  totalItems={
                    grouping
                      ? Array.from(grouping.ungroupedFields).filter(
                          (tempField) => !fields[tempField].hiddenInEdit,
                        ).length
                      : Object.keys(fields).filter(
                          (tempField) => !fields[tempField]?.hiddenInEdit,
                        ).length
                  }
                >
                  {field.element({
                    field,
                    state: {
                      isEdit: true,
                    },
                    setDialogContent: setEditDialogData,
                    register,
                    control,
                    setValue,
                  })}
                </DialogGridItemWrapper>
              );
            })}
            {grouping?.groups.length ? (
              <Grid2 container size={12} key="editDialog-grid-group">
                {grouping.groups.map((group) => {
                  return (
                    <Grid2
                      size={{
                        ...(group.direction === "column"
                          ? gridSizing
                          : gridSizingRow),
                      }}
                      key={`editDialog-${group.keys.join("-")}-group`}
                    >
                      <Stack direction={group.direction}>
                        {group.keys.map((key) => {
                          const typedKey = key;
                          const field = fields[typedKey];
                          if (field.hiddenInEdit) return null;
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
                                state: {
                                  isEdit: true,
                                },
                                setDialogContent: setEditDialogData,
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
            {bottomElement && dialogData ? (
              <Grid2 container size={12} key="editDialog-grid-bottom">
                {bottomElement}
              </Grid2>
            ) : null}
          </Grid2>
          {/* </Box> */}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="text"
            color="error"
            onClick={() => {
              openDialog("delete");
            }}
            disabled={loading}
            sx={{ mr: "auto" }}
          >
            Slett
          </Button>
          <Button
            variant="outlined"
            onClick={() => cancelDialog()}
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
