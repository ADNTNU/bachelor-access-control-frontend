function getRedirectUrl(
  basePath: string,
  redirect?: string | null,
  urlEncode = true,
) {
  if (!redirect) {
    return basePath;
  }
  return `${basePath}?rd=${urlEncode ? encodeURIComponent(redirect) : redirect}`;
}

export const routes = {
  index: "/",
  dashboard: {
    index: "/dashboard",
    home: (companyId: string | number) => `/dashboard/${companyId}`,
    administrators: (companyId: string | number) =>
      `/dashboard/${companyId}/administrators`,
    apiKeys: (companyId: string | number) => `/dashboard/${companyId}/api-keys`,
  },
  auth: {
    forgotPassword: "/auth/forgot-password",
    login: (redirect?: string | null, urlEncode = true) => {
      return getRedirectUrl("/auth/login", redirect, urlEncode);
    },
    signOut: (redirect?: string | null, urlEncode = true) => {
      return getRedirectUrl("/auth/sign-out", redirect, urlEncode);
    },
  },
  error: {
    noCompanies: "/error/no-companies",
    unauthorized: (redirect?: string | null, urlEncode = true) => {
      return getRedirectUrl("/error/unauthorized", redirect, urlEncode);
    },
    unknown: (redirect?: string | null, urlEncode = true) => {
      return getRedirectUrl("/error/unknown", redirect, urlEncode);
    },
  },
};
