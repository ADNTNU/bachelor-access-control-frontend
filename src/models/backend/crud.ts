import type { APIResponse } from "../utils";

export type PaginationData = {
  totalPages: number;
  totalElements: number;
};

export type PaginatedData<T> = {
  data: T[];
} & PaginationData;

export type AdminCrudListResponse<T> = APIResponse &
  Partial<
    {
      data: T[];
    } & PaginationData
  >;
