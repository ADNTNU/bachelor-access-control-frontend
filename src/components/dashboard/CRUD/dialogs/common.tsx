"use client";

import {
  Box,
  Grid2,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import assert from "assert";
import type {
  AsJson,
  CompileTimeCheck,
  RequireKeys,
  WithId,
} from "@models/utils";
import type {
  ComponentPropsWithRef,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import NextImage from "next/image";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormRegister,
  type UseFormSetError,
  type UseFormSetValue,
} from "react-hook-form";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";

export type FieldValuesWithId = FieldValues & WithId;

export type DialogErrorObject<T extends WithId> = Partial<
  Record<"generic" | keyof T, string>
> | null;

export type GroupingProps<T extends FieldValues> = {
  groups: DialogGroup<T>[];
  ungroupedFields: Set<keyof T>;
};

export type DialogSubmitHandler<T extends FieldValues> = (
  data: T,
  props: {
    setError: UseFormSetError<T>;
    setGlobalError: Dispatch<SetStateAction<string | null>>;
    cancelDialog: (force?: boolean) => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fields: DialogFields<T>;
    companyId: number;
    token: string;
    openAnyDialog: (dialog: string, data: object, force?: boolean) => void;
  },
  event?: React.BaseSyntheticEvent,
) => Promise<boolean>;

export type DialogDeleteHandler<T extends FieldValuesWithId> = (props: {
  identifiers: T["id"][];
  setGlobalError: Dispatch<SetStateAction<string | null>>;
  fields: DialogFields<T>;
  companyId: number;
  token: string;
}) => Promise<boolean>;

export type DialogSubmitData<T> = { [key in keyof T]?: AsJson<T[key]> };

export type DialogGroup<T> = {
  keys: (keyof T)[];
  direction: "column" | "row";
};

export type DialogFields<T extends FieldValues> = {
  [key in keyof RequireKeys<T>]: {
    key: key;
    label: string;
    placeholder?: string;
    required: boolean;
    addable: boolean;
    editable: boolean;
    hiddenInEdit?: boolean;
    element: (props: Omit<DialogGridItemProps<T>, "type">) => ReactNode;
  };
};

type SimpleFieldInputType =
  | "checkbox"
  | "date"
  | "datetime"
  | "image"
  | "integer"
  | "float"
  | "text"
  | "textarea";

export type DialogGridItemProps<T extends FieldValues> = {
  field: DialogFields<T>[keyof T];
  setDialogContent: Dispatch<SetStateAction<T | null>>;
  setHasDoneChanges: Dispatch<SetStateAction<boolean>>;
  // value?: T[keyof T];
  state?: {
    isEdit?: boolean;
    isDelete?: boolean;
    // error?: FieldErrors<T>[keyof DeepRequired<T> | 'root'];
  };
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  registerOptions?: Parameters<UseFormRegister<T>>[1];
  type: SimpleFieldInputType;
  grid?: boolean;
};

export async function getDataURLFromFile(file: File) {
  const res = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  return res;
}

export const dateTimeFormat = "DD/MM/YYYY HH:mm:ss";

type SimpleFieldInputProps<T extends FieldValues> = {
  type: SimpleFieldInputType;
} & Omit<DialogGridItemProps<T>, "grid">;

export function SimpleFieldInput<T extends FieldValues>(
  props: SimpleFieldInputProps<T>,
) {
  const {
    field,
    state,
    type,
    control,
    setValue,
    setDialogContent,
    setHasDoneChanges,
  } = props;
  const { key, editable } = field;
  const { isEdit, isDelete } = state ?? {};

  assert(typeof key === "string", "Key must be a string");

  const fileOnChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    assert("files" in e.target, "File change event must have files prop");
    const file = e.target.files?.[0];
    assert(file instanceof File, "No file selected");

    const canvas = document.getElementById(
      `${key}-canvas`,
    ) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context not available");
    }

    const readFileAsDataURL = (_file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () =>
          reject(new Error(reader.error?.message ?? "FileReader error"));
        reader.readAsDataURL(_file);
      });
    };

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const dataURL = await readFileAsDataURL(file);
      const img = await loadImage(dataURL);

      // Get the original width and height of the image
      const originalWidth = img.width;
      const originalHeight = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      let targetWidth = 150;
      let targetHeight = 150;

      if (originalWidth > originalHeight) {
        targetHeight = (originalHeight / originalWidth) * targetWidth;
      } else {
        targetWidth = (originalWidth / originalHeight) * targetHeight;
      }

      // Set canvas size to the new dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw the image with the new dimensions
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const imgSrc = canvas.toDataURL();

      setDialogContent((prev) => {
        if (prev) {
          return { ...prev, [key]: imgSrc };
        }
        return { [key]: imgSrc } as T;
      });
      setHasDoneChanges(true);

      setValue(key as Path<T>, imgSrc as PathValue<T, Path<T>>);
    } catch (error) {
      console.error("Error loading file or image:", error);
    }
  };

  switch (type) {
    case "textarea":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({
            field: { value, ...controllerField },
            fieldState: { error },
          }) => (
            <TextField
              multiline
              fullWidth
              error={!!error}
              helperText={error?.message}
              disabled={(isEdit && !editable) ?? isDelete}
              value={value || ""}
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
              required={field.required}
            />
          )}
        />
      );
    case "integer":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) => (
            <TextField
              fullWidth
              error={!!error}
              helperText={error?.message}
              disabled={(isEdit && !editable) ?? isDelete}
              type="number"
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
              required={field.required}
            />
          )}
        />
      );
    case "float":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) => (
            <TextField
              fullWidth
              error={!!error}
              helperText={error?.message}
              disabled={(isEdit && !editable) ?? isDelete}
              type="number"
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
              required={field.required}
            />
          )}
        />
      );
    case "image":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({
            field: { value, ...controllerField },
            fieldState: { error },
          }) => (
            <Stack direction="column" gap={2}>
              <>
                <TextField
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  disabled={(isEdit && !editable) ?? isDelete}
                  type="file"
                  {...controllerField}
                  onChange={fileOnChange}
                  required={field.required}
                />
                <canvas id={`${key}-canvas`} style={{ display: "none" }} />
              </>
              {value && (
                <Box
                  sx={{ width: "100%", height: "100px", position: "relative" }}
                >
                  <NextImage
                    src={value}
                    alt="Bilde"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="100px"
                  />
                </Box>
              )}
            </Stack>
          )}
        />
      );
    case "date":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) => (
            <DatePicker
              disabled={(isEdit && !editable) ?? isDelete}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  required: field.required,
                },
                field: {
                  clearable: !field.required,
                },
              }}
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
            />
          )}
        />
      );
    case "datetime":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) => (
            <DateTimePicker
              disabled={(isEdit && !editable) ?? isDelete}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  required: field.required,
                },
              }}
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
            />
          )}
        />
      );
    case "checkbox":
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({ field: { value, ...controllerField } }) => (
            <Switch
              // error={!!error}
              // helperText={error?.message as string}
              checked={value || false}
              disabled={(isEdit && !editable) ?? isDelete}
              type="checkbox"
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
              required={field.required}
            />
          )}
        />
      );
    default:
      const compileTimeCheck: "text" | CompileTimeCheck = type;
      if (compileTimeCheck !== "text") {
        console.error("Unknown field type:", compileTimeCheck);
      }
      return (
        <Controller
          name={key as Path<T>}
          control={control}
          render={({
            field: { value, ...controllerField },
            fieldState: { error },
          }) => (
            <TextField
              fullWidth
              error={!!error}
              helperText={error?.message}
              disabled={(isEdit && !editable) ?? isDelete}
              value={value || ""}
              {...controllerField}
              onChange={(e) => {
                setHasDoneChanges(true);
                controllerField.onChange(e);
              }}
              required={field.required}
            />
          )}
        />
      );
  }
}

type DialogItemInputWrapperProps = {
  label: string;
  children: ReactNode;
};

export function DialogItemInputWrapper(props: DialogItemInputWrapperProps) {
  const { label, children } = props;

  return (
    <Stack>
      <Typography variant="subtitle1" width="100%">
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

export const gridSizing = {
  xs: 12,
  md: 6,
  lg: 4,
};
// Should always be double the size of gridSizing, max 12
export const gridSizingRow = {
  xs: 12,
  md: 12,
  lg: 8,
};

export const gridSizingFull = {
  xs: 12,
};

type DialogGridItemWrapperProps = {
  grid?: boolean;
  children?: ReactNode;
  gridProps?: ComponentPropsWithRef<typeof Grid2>;
  totalItems: number;
};

export function DialogGridItemWrapper(props: DialogGridItemWrapperProps) {
  const { grid = true, children, gridProps, totalItems } = props;

  if (!grid) {
    return children;
  }

  return (
    <Grid2
      size={{ ...(totalItems <= 2 ? gridSizingFull : gridSizing) }}
      {...gridProps}
    >
      {children}
    </Grid2>
  );
}

export function DialogGridItem<T extends FieldValues>(
  props: DialogGridItemProps<T>,
) {
  const { field } = props;
  const { label } = field;

  return (
    <DialogItemInputWrapper label={label}>
      <SimpleFieldInput {...props} />
    </DialogItemInputWrapper>
  );
}
