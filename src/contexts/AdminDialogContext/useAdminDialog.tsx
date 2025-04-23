"use client";

import { type FieldValuesWithId } from "@components/dashboard/CRUD/dialogs/common";
import {
  AdminDialogsContext,
  type AdminDialogsContextType,
} from "@/contexts/AdminDialogContext/AdminDialogContext";
import { type WithId } from "@models/utils";
import { useContext } from "react";

const useAdminDialog = <T extends FieldValuesWithId, U extends WithId>() => {
  const adminDialogsContext = useContext(AdminDialogsContext);
  if (adminDialogsContext === undefined) {
    throw new Error(
      "AdminDialogsContext must be inside a AdminDialogsProvider",
    );
  }
  return adminDialogsContext as unknown as AdminDialogsContextType<T, U>;
};

export default useAdminDialog;
