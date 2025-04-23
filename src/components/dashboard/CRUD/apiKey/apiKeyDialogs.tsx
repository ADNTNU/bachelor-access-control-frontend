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
import { useParams } from "next/navigation";

type ApiKeyDialogsProps = {
  token: string;
};

export default function ApiKeyDialogs(props: ApiKeyDialogsProps) {
  const { token } = props;
  const { companyId } = useParams<{ companyId: string }>();
  const companyIdNumber = Number(companyId);

  return (
    <>
      <AddDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        fields={apiKeyFields}
        onSubmit={apiKeyCreateHandler}
        title="Invite apiKey"
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
      <EditDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        fields={apiKeyFields}
        onSubmit={apiKeyUpdateHandler}
        title="Update apiKey"
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
      <DeleteDialog<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
        singularTitle="Are you sure you want to delete the apiKey?"
        pluralTitle="Are you sure you want to delete the selected apiKeys?"
        fields={apiKeyFields}
        onSubmit={apiKeysDeleteHandler}
        defaultValues={apiKeyDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
    </>
  );
}
