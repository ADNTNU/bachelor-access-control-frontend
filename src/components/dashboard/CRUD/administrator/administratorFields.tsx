import {
  type APIEncode,
  type CompileTimeCheck,
  type OverrideType,
  type RequireKeys,
} from "@models/utils";
import apiRoutes from "@/apiRoutes";
import { type DefaultValues } from "react-hook-form";
import {
  type DialogDeleteHandler,
  type DialogFields,
  DialogGridItem,
  type DialogGroup,
  type DialogSubmitHandler,
  type GroupingProps,
} from "@components/dashboard/CRUD/dialogs/common";
import type {
  AdministratorListDto,
  DeleteAdministratorRequestBody,
  InviteAdministratorRequestBody,
  UpdateAdministratorRequestBody,
} from "@models/dto/administrator";

type AdministratorFieldsOverrides = {
  accepted: never;
  status: "Invited" | "Active";
};
export type AdministratorDialogFields = OverrideType<
  APIEncode<AdministratorListDto>,
  AdministratorFieldsOverrides
>;

export const addableFields = ["enabled", "username"] as const;
export type AdministratorDialogFieldsAddable = Pick<
  AdministratorDialogFields,
  (typeof addableFields)[number]
>;

export const editableFields = ["enabled"] as const;
export type AdministratorDialogFieldsEditable = Pick<
  AdministratorDialogFields,
  (typeof editableFields)[number]
>;

export const deletableFields = ["id"] as const;
export type AdministratorDialogFieldsDeletable = Pick<
  AdministratorDialogFields,
  (typeof deletableFields)[number]
>;

export function administratorRowDataToDialogData(
  data: APIEncode<AdministratorListDto>,
): AdministratorDialogFields {
  const { accepted, enabled, ...rest } = data;
  return {
    ...rest,
    enabled,
    status: accepted ? "Active" : "Invited",
  };
}

export const administratorDefaultValues: RequireKeys<
  DefaultValues<AdministratorDialogFields>
> = {
  id: 0,
  name: "",
  enabled: false,
  status: "Invited",
  username: "",
};

const administratorFields: DialogFields<AdministratorDialogFields> = {
  id: {
    key: "id",
    label: "ID",
    required: false,
    addable: false,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  name: {
    key: "name",
    label: "Name",
    required: false,
    addable: false,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  status: {
    key: "status",
    label: "Status",
    required: false,
    addable: false,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  username: {
    key: "username",
    label: "Username",
    required: true,
    addable: true,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  enabled: {
    key: "enabled",
    label: "Enabled",
    required: false,
    addable: true,
    editable: true,
    element: (props) => <DialogGridItem {...props} type="checkbox" />,
  },
};

export const administratorInviteHandler: DialogSubmitHandler<
  AdministratorDialogFields
> = async (data, props): Promise<boolean> => {
  const { setGlobalError, cancelDialog, setLoading, companyId, token } =
    props || {};

  setLoading(true);

  const {
    id: _id,
    name: _name,
    status: _status,
    enabled,
    username,
    ...rest
  } = data;

  const compileTimeCheck: CompileTimeCheck = rest;
  const compileTimeCheckKeys = Object.keys(compileTimeCheck);
  if (compileTimeCheckKeys.length) {
    console.warn("Unwanted data keys: ", compileTimeCheckKeys.join(", "));
  }

  const POSTbody: InviteAdministratorRequestBody = {
    companyId,
    enabled,
    role: "owner",
    username,
  };

  const res = await fetch(apiRoutes.crud.administrator.invite, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(POSTbody satisfies InviteAdministratorRequestBody),
  });
  if (!res.ok) {
    // const body = (await res.json()) as ProductPOSTResponse;
    // const { message, error, errors } = body;
    // console.error(message, error);
    // if (errors && (setError || setGlobalError)) {
    //   Object.keys(errors).forEach((key) => {
    //     const typedKey = key as keyof typeof errors;
    //     assert(errors[typedKey]);

    //     if (typedKey === "generic") {
    //       if (setGlobalError) {
    //         setGlobalError(JSON.stringify(errors[typedKey]));
    //       }
    //       console.error("Global error: ", errors[typedKey]);
    //       setLoading(false);
    //       return;
    //     }

    //     if (setError) {
    //       setError(typedKey, { type: "manual", message: translatedError });
    //     }
    //   });
    // }
    if (setGlobalError) {
      setGlobalError("Failed to invite administrator.");
    }
    setLoading(false);
    return false;
  }
  cancelDialog();
  setLoading(false);
  return true;
};

export const administratorUpdateHandler: DialogSubmitHandler<
  AdministratorDialogFields
> = async (data, props): Promise<boolean> => {
  const { setGlobalError, cancelDialog, setLoading, companyId, token } =
    props || {};

  setLoading(true);

  const {
    id,
    enabled,
    name: _name,
    status: _status,
    username: _username,
    ...rest
  } = data;

  const compileTimeCheck: CompileTimeCheck = rest;
  const compileTimeCheckKeys = Object.keys(compileTimeCheck);
  if (compileTimeCheckKeys.length) {
    console.warn("Unwanted PATCH data keys: ", compileTimeCheckKeys.join(", "));
  }

  const updateBody: UpdateAdministratorRequestBody = {
    companyId,
    enabled,
    role: "owner",
  };

  const res = await fetch(apiRoutes.crud.administrator.id(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateBody satisfies UpdateAdministratorRequestBody),
  });
  if (!res.ok) {
    if (setGlobalError) {
      setGlobalError("Failed to update administrator.");
    }
    setLoading(false);
    return false;
  }
  cancelDialog();
  setLoading(false);
  return true;
};

export const administratorsDeleteHandler: DialogDeleteHandler<
  AdministratorDialogFields
> = async ({
  identifiers,
  companyId,
  setGlobalError,
  token,
}): Promise<boolean> => {
  const res = await fetch(apiRoutes.crud.administrator.index, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      administratorIds: identifiers,
      companyId,
    } satisfies DeleteAdministratorRequestBody),
  });
  if (!res.ok) {
    if (setGlobalError) {
      setGlobalError("Failed to delete administrator(s).");
    }
    return false;
  }
  return true;
};

export const administratorFieldGroups: DialogGroup<AdministratorDialogFields>[] =
  [];

function getAdministratorFieldsGrouping(): GroupingProps<AdministratorDialogFields> {
  const tempGroupedFields = new Set<
    keyof DialogFields<AdministratorDialogFields>
  >();
  const tempUngroupedFields = new Set<
    keyof DialogFields<AdministratorDialogFields>
  >();
  if (administratorFieldGroups?.length) {
    administratorFieldGroups.forEach((group) => {
      group.keys.forEach((groupKey) => {
        tempGroupedFields.add(groupKey);
      });
    });
    (
      Object.keys(administratorFields) as (keyof typeof administratorFields)[]
    ).forEach((fieldKey) => {
      if (!tempGroupedFields.has(fieldKey)) {
        tempUngroupedFields.add(fieldKey);
      }
    });
  }
  return {
    groups: administratorFieldGroups,
    ungroupedFields: tempUngroupedFields,
  };
}

export const administratorFieldsGrouping = getAdministratorFieldsGrouping();

export default administratorFields;
