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
import { redirect, useParams } from "next/navigation";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { routes } from "@/routes";

type AdministratorDialogsProps = {
  currentUrl: string;
};

export default function AdministratorDialogs(props: AdministratorDialogsProps) {
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
    console.warn("No token found, redirecting to unauthorized page4");
    redirect(routes.error.unauthorized(currentUrl));
  }

  return (
    <>
      <AddDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        fields={administratorFields}
        onSubmit={administratorInviteHandler}
        title="Invite administrator"
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <EditDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        fields={administratorFields}
        onSubmit={administratorUpdateHandler}
        title="Update administrator"
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <DeleteDialog<AdministratorDialogFields, APIEncode<AdministratorListDto>>
        singularTitle="Are you sure you want to remove this administrator from the company?"
        pluralTitle="Are you sure you want to remove the selected administrators from the company?"
        fields={administratorFields}
        onSubmit={administratorsDeleteHandler}
        defaultValues={administratorDefaultValues}
        companyId={companyIdNumber}
        currentUrl={currentUrl}
      />
      <ConfirmDialog />
    </>
  );
}
