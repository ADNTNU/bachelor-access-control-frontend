"use client";

import type { APIEncode } from "@models/utils";
import type { AdministratorDialogFields } from "./administratorFields";
import type { AdministratorListDto } from "@models/dto/administrator";
import administratorFields, {
  administratorDefaultValues,
  administratorInviteHandler,
  administratorsDeleteHandler,
  administratorUpdateHandler,
} from "./administratorFields";
import AddDialog from "@components/dashboard/CRUD/dialogs/AddDialog";
import EditDialog from "@components/dashboard/CRUD/dialogs/EditDialog";
import DeleteDialog from "@components/dashboard/CRUD/dialogs/DeleteDialog";
import { useParams } from "next/navigation";

type AdministratorDialogsProps = {
  token: string;
};

export default function AdministratorDialogs(props: AdministratorDialogsProps) {
  const { token } = props;
  const { companyId } = useParams<{ companyId: string }>();
  const companyIdNumber = Number(companyId);

  return (
    <>
      <AddDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        fields={administratorFields}
        onSubmit={administratorInviteHandler}
        title="Invite administrator"
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
      <EditDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        fields={administratorFields}
        onSubmit={administratorUpdateHandler}
        title="Update administrator"
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
      <DeleteDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        singularTitle="Are you sure you want to delete the administrator?"
        pluralTitle="Are you sure you want to delete the selected administrators?"
        fields={administratorFields}
        onSubmit={administratorsDeleteHandler}
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        token={token}
      />
    </>
  );
}
