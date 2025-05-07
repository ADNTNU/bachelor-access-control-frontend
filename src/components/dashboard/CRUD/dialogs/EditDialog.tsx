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
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type WithId } from "@models/utils";
import {
  type DefaultValues,
  type SubmitHandler,
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
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "@/routes";

type EditDialogProps<T extends FieldValuesWithId> = {
  fields: DialogFields<T>;
  grouping?: GroupingProps<T>;
  onSubmit: DialogSubmitHandler<T>;
  title: string;
  useFormProps?: UseFormProps<T>;
  defaultValues: DefaultValues<T>;
  bottomElement?: ReactNode;
  companyId: number;
  currentUrl: string;
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
    editDialogOpen: open,
    editDialogData: dialogData,
    setDeleteDialogData,
    error,
    setError: setGlobalError,
    openDialog,
    cancelDialog,
    setEditDialogData,
    setCommitedChanges,
    setHasDoneChanges,
    currentDialog,
    openAnyDialog,
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
    if (!currentDialog) {
      reset();
      setLoading(false);
    }
    if (!open) {
      setGlobalError(null);
    }
  }, [currentDialog, open, reset, setGlobalError]);

  useEffect(() => {
    if (prevData === null && dialogData) {
      setDeleteDialogData(dialogData);
      setInitialDialogData(dialogData);
    }
    setPrevData(dialogData);
  }, [dialogData, prevData, setDeleteDialogData]);

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
      cancelDialog,
      companyId,
      fields,
      onSubmit,
      openAnyDialog,
      setCommitedChanges,
      setError,
      setGlobalError,
      token,
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
                    setHasDoneChanges,
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
            Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => cancelDialog()}
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
