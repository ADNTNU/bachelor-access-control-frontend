import type { AdminCrudListResponse } from "@models/backend/crud";

export type ListAdministratorRequestBody = {
  companyId: number;
  page: number;
  size: number;
};

export type AdministratorListDto = {
  id: number;
  enabled: boolean;
  accepted: boolean;
  username: string;
  name: string;
};

export type ListAdministratorResponse =
  AdminCrudListResponse<AdministratorListDto>;

export type InviteAdministratorRequestBody = {
  companyId: number;
  username: string;
  enabled: boolean;
  role: string;
};

export type UpdateAdministratorRequestBody = {
  companyId: number;
  enabled: boolean;
  role: string;
};

export type DeleteAdministratorRequestBody = {
  administratorIds: number[];
  companyId: number;
};
