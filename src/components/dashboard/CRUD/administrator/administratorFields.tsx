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
import { authenticatedFetch } from "@/utils/fetcher";

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
  email: "",
  registered: false,
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
  email: {
    key: "email",
    label: "Email",
    required: true,
    addable: true,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  username: {
    key: "username",
    label: "Username",
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
  registered: {
    key: "registered",
    label: "Registered",
    required: false,
    addable: false,
    editable: false,
    hiddenInEdit: true,
    hiddenInDelete: true,
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
    username: _username,
    registered: _registered,
    enabled,
    email,
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
    email,
  };

  const res = await authenticatedFetch(
    apiRoutes.crud.administrator.invite,
    token,
    {
      method: "POST",
      body: JSON.stringify(POSTbody satisfies InviteAdministratorRequestBody),
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      console.error("Unauthorized request to invite administrator.");
      if (setGlobalError) {
        setGlobalError("Authentication error. Please log in again.");
      }
    } else if (res.status === 403) {
      console.error("Forbidden request to invite administrator.");
      if (setGlobalError) {
        setGlobalError(
          "You don't have permission to invite this administrator.",
        );
      }
    } else if (res.status === 404) {
      console.error("Not found request to invite administrator.");
      if (setGlobalError) {
        setGlobalError("Couldn’t find the requested resource.");
      }
    } else if (res.status === 400) {
      console.error("Bad request to invite administrator.");
      if (setGlobalError) {
        setGlobalError("Malformed data in request to invite administrator.");
      }
    }
    if (setGlobalError) {
      setGlobalError("Failed to invite administrator. Please try again later.");
    }

    setLoading(false);
    return false;
  }

  cancelDialog(true);
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
    email: _email,
    registered: _registered,
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

  const res = await authenticatedFetch(
    apiRoutes.crud.administrator.id(id),
    token,
    {
      method: "PUT",
      body: JSON.stringify(updateBody satisfies UpdateAdministratorRequestBody),
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      console.error("Unauthorized request to update administrator.");
      if (setGlobalError) {
        setGlobalError("Authentication error. Please log in again.");
      }
    } else if (res.status === 403) {
      console.error("Forbidden request to update administrator.");
      if (setGlobalError) {
        setGlobalError(
          "You don't have permission to update this administrator.",
        );
      }
    } else if (res.status === 404) {
      console.error("Not found request to update administrator.");
      if (setGlobalError) {
        setGlobalError("Couldn’t find the requested resource.");
      }
    } else if (res.status === 400) {
      console.error("Bad request to update administrator.");
      if (setGlobalError) {
        setGlobalError("Malformed data in request to update administrator.");
      }
    } else if (setGlobalError) {
      setGlobalError("Failed to update administrator. Please try again later.");
    }

    setLoading(false);
    return false;
  }

  cancelDialog(true);
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
  const res = await authenticatedFetch(
    apiRoutes.crud.administrator.index,
    token,
    {
      method: "DELETE",
      body: JSON.stringify({
        administratorIds: identifiers,
        companyId,
      } satisfies DeleteAdministratorRequestBody),
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      console.error("Unauthorized request to delete administrator(s).");
      if (setGlobalError) {
        setGlobalError("Authentication error. Please log in again.");
      }
    } else if (res.status === 403) {
      console.error("Forbidden request to delete administrator(s).");
      if (setGlobalError) {
        setGlobalError(
          "You don't have permission to delete this administrator(s).",
        );
      }
    } else if (res.status === 404) {
      console.error("Not found request to delete administrator(s).");
      if (setGlobalError) {
        setGlobalError("Couldn’t find the requested resource.");
      }
    } else if (res.status === 400) {
      console.error("Bad request to delete administrator(s).");
      if (setGlobalError) {
        setGlobalError("Malformed data in request to delete administrator(s).");
      }
    } else if (setGlobalError) {
      setGlobalError(
        "Failed to delete administrator(s). Please try again later.",
      );
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
