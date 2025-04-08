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
      if (!redirect) {
        return "/login";
      }
      return `/login?rd=${urlEncode ? encodeURIComponent(redirect) : redirect}`;
    },
  },
  error: {
    noCompanies: "/error/no-companies",
  },
};
