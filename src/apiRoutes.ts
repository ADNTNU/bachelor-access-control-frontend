const crudAdministratorBase = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator`;
const crudApiKeyBase = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api-key`;

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
  company: {
    all: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/company/all`,
  },
  auth: {
    login: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`,
    signOut: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/sign-out`,
    requestPasswordReset: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/request-password-reset`,
    resetPassword: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/reset-password`,
  },
  administrator: {
    registerFromInvite: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator/register-from-invite`,
    acceptInvite: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/administrator/accept-invite`,
  },
};

export default apiRoutes;
