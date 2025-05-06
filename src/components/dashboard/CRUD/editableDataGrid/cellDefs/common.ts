import {
  getGridDateOperators,
  type GridColDef,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";

export type TypeSafeColDef<T extends GridValidRowModel, U> = {
  field: keyof T | keyof U;
} & GridColDef<T>;

export type FieldFromColumns<T> = T extends (infer U)[]
  ? U extends { field: infer F }
    ? F
    : never
  : never;

export function dateValueFormatter(
  data?: Date | number,
  type: "date" | "dateTime" = "dateTime",
): string {
  if (typeof data === "undefined") {
    return "";
  }
  const formatString = type === "date" ? "DD/MM/YYYY" : "DD/MM/YYYY HH:mm:ss";

  const parsedDate = typeof data === "number" ? data : data.valueOf();
  return dayjs(parsedDate).format(formatString);
}

export async function defaultValueFormatter<T>(
  data?: T[keyof T],
): Promise<string> {
  if (!data) return "";
  if (data instanceof Date) {
    return dateValueFormatter(data);
  }
  return data.toString();
}

export function defaultDateFilterOperators() {
  return getGridDateOperators().filter(
    (op) => op.value !== "isEmpty" && op.value !== "isNotEmpty",
  );
}

export type Sort<T> = {
  field: keyof T;
  direction: "asc" | "desc";
};
