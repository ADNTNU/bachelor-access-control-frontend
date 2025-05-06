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
  email: string;
  name: string;
};

export type ListAdministratorResponse =
  AdminCrudListResponse<AdministratorListDto>;

export type InviteAdministratorRequestBody = {
  companyId: number;
  email: string;
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
