function getRedirectUrl(basePath: string, redirect?: string, urlEncode = true) {
  if (!redirect) {
    return basePath;
  }
  return `${basePath}?rd=${urlEncode ? encodeURIComponent(redirect) : redirect}`;
}

export const routes = {
  index: "/",
  dashboard: {
    index: "/dashboard",
    home: (companyId: string) => `/dashboard/${companyId}`,
    users: (companyId: string) => `/dashboard/${companyId}/users`,
    apiKeys: (companyId: string) => `/dashboard/${companyId}/api-keys`,
  },
  auth: {
    forgotPassword: "/forgot-password",
    login: (redirect?: string, urlEncode = true) => {
      return getRedirectUrl("/auth/login", redirect, urlEncode);
    },
    signOut: (redirect?: string, urlEncode = true) => {
      return getRedirectUrl("/auth/sign-out", redirect, urlEncode);
    },
  },
  error: {
    noCompanies: "/error/no-companies",
    unauthorized: (redirect?: string, urlEncode = true) => {
      return getRedirectUrl("/error/unauthorized", redirect, urlEncode);
    },
    unknown: (redirect?: string, urlEncode = true) => {
      return getRedirectUrl("/error/unknown", redirect, urlEncode);
    },
  },
};
