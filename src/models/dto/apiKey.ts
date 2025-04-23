import type { AdminCrudListResponse } from "@models/backend/crud";

export type ListApiKeyRequestBody = {
  companyId: number;
  page: number;
  size: number;
};

export type ApiKeyListDto = {
  id: number;
  enabled: boolean;
  clientId: string;
  name: string;
  description: string;
  scopes: string[];
};

export type ListApiKeyResponse = AdminCrudListResponse<ApiKeyListDto>;

export type CreateApiKeyRequestBody = {
  enabled: boolean;
  name: string;
  description: string;
  companyId: number;
  scopes: string[];
};
export type CreateApiKeyResponseBody = {
  id: number;
  clientId: string;
  clientSecret: string;
};

export type UpdateApiKeyRequestBody = {
  companyId: number;
  enabled: boolean;
  name: string;
  description: string;
  scopes: string[];
};

export type RerollApiKeyRequestBody = {
  id: number;
  companyId: number;
};

export type RerollApiKeyResponseBody = {
  clientId: string;
  clientSecret: string;
};

export type DeleteApiKeyRequestBody = {
  apiKeyIds: number[];
  companyId: number;
};
