"use client";

import type { APIEncode } from "@models/utils";
import type { ApiKeyDialogFields } from "./apiKeyFields";
import type { ApiKeyListDto } from "@models/dto/apiKey";
import apiKeyFields, {
  apiKeyDefaultValues,
  apiKeyCreateHandler,
  apiKeysDeleteHandler,
  apiKeyUpdateHandler,
} from "./apiKeyFields";
import AddDialog from "@components/dashboard/CRUD/dialogs/AddDialog";
import EditDialog from "@components/dashboard/CRUD/dialogs/EditDialog";
import DeleteDialog from "@components/dashboard/CRUD/dialogs/DeleteDialog";
import { redirect, useParams } from "next/navigation";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { routes } from "@/routes";
import { ClientIdSecretDialog } from "./ClientIdSecretDialog";

type ApiKeyDialogsProps = {
  currentUrl: string;
};

export default function ApiKeyDialogs(props: ApiKeyDialogsProps) {
  const { currentUrl } = props;
  const { companyId } = useParams<{ companyId: string }>();
  const companyIdNumber = Number(companyId);

  const session = useSession();

  const token = useMemo(() => {
    if (session.status === "authenticated") {
      return session.data?.accessToken;
    }
    return undefined;
  }, [session]);

  if (!token && session.status !== "loading") {
    console.warn("No token found, redirecting to unauthorized page6");
    redirect(routes.error.unauthorized(currentUrl));
  }

  return (
    <>
      <AddDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        fields={apiKeyFields}
        onSubmit={apiKeyCreateHandler}
        title="Invite apiKey"
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <EditDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        fields={apiKeyFields}
        onSubmit={apiKeyUpdateHandler}
        title="Update apiKey"
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <DeleteDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        singularTitle="Are you sure you want to delete the apiKey?"
        pluralTitle="Are you sure you want to delete the selected apiKeys?"
        fields={apiKeyFields}
        onSubmit={apiKeysDeleteHandler}
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <ConfirmDialog />
      <ClientIdSecretDialog />
    </>
  );
}
