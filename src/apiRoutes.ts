const crudAdministratorBase = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator`;
const crudApiKeyBase = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api-key`;
const authBase = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth`;
const internalBaseURL = process.env.BACKEND_INTERNAL_URL;

const apiRoutes = {
  crud: {
    administrator: {
      index: `${crudAdministratorBase}`,
      list: `${crudAdministratorBase}/list`,
      invite: `${crudAdministratorBase}/invite`,
      id: (id: number | string) => `${crudAdministratorBase}/${id}`,
    },
    apiKey: {
      index: `${crudApiKeyBase}`,
      list: `${crudApiKeyBase}/list`,
      id: (id: number | string) => `${crudApiKeyBase}/${id}`,
    },
  },
  server: {
    company: {
      all: `${internalBaseURL}/company/all`,
    },
  },
  auth: {
    login: `${authBase}/login`,
    signOut: `${authBase}/sign-out`,
    requestPasswordReset: `${authBase}/request-password-reset`,
    resetPassword: `${authBase}/reset-password`,
  },
  administrator: {
    registerFromInvite: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator/register-from-invite`,
    acceptInvite: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator/accept-invite`,
  },
};

export default apiRoutes;
