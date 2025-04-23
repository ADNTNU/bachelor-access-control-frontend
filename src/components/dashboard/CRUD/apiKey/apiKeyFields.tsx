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
  ApiKeyListDto,
  CreateApiKeyRequestBody,
  UpdateApiKeyRequestBody,
  DeleteApiKeyRequestBody,
} from "@models/dto/apiKey";

type ApiKeyFieldsOverrides = {
  scopes: string;
};
export type ApiKeyDialogFields = OverrideType<
  APIEncode<ApiKeyListDto>,
  ApiKeyFieldsOverrides
>;

export const addableFields = ["name", "description"] as const;
export type ApiKeyDialogFieldsAddable = Pick<
  ApiKeyDialogFields,
  (typeof addableFields)[number]
>;

export const editableFields = ["name", "description"] as const;
export type ApiKeyDialogFieldsEditable = Pick<
  ApiKeyDialogFields,
  (typeof editableFields)[number]
>;

export const deletableFields = ["id"] as const;
export type ApiKeyDialogFieldsDeletable = Pick<
  ApiKeyDialogFields,
  (typeof deletableFields)[number]
>;

export function apiKeyRowDataToDialogData(
  data: APIEncode<ApiKeyListDto>,
): ApiKeyDialogFields {
  const { scopes, ...rest } = data;
  return {
    scopes: scopes?.length ? scopes.join(",") : "",
    ...rest,
  };
}

export const apiKeyDefaultValues: RequireKeys<
  DefaultValues<ApiKeyDialogFields>
> = {
  id: 0,
  enabled: true,
  clientId: "",
  name: "",
  description: "",
  scopes: "",
};

const apiKeyFields: DialogFields<ApiKeyDialogFields> = {
  id: {
    key: "id",
    label: "ID",
    required: false,
    addable: false,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  clientId: {
    key: "clientId",
    label: "Client ID",
    required: false,
    addable: false,
    editable: false,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  enabled: {
    key: "enabled",
    label: "Enabled",
    required: true,
    addable: true,
    editable: true,
    element: (props) => <DialogGridItem {...props} type="checkbox" />,
  },
  name: {
    key: "name",
    label: "Name",
    required: true,
    addable: true,
    editable: true,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  description: {
    key: "description",
    label: "Description",
    required: true,
    addable: true,
    editable: true,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
  scopes: {
    key: "scopes",
    label: "Scopes",
    placeholder: "Comma separated scopes",
    required: true,
    addable: true,
    editable: true,
    element: (props) => <DialogGridItem {...props} type="text" />,
  },
};

export const apiKeyCreateHandler: DialogSubmitHandler<
  ApiKeyDialogFields
> = async (data, props): Promise<boolean> => {
  const { setGlobalError, cancelDialog, setLoading, companyId, token } =
    props || {};

  setLoading(true);

  const {
    id: _id,
    clientId: _clientId,
    enabled,
    name,
    description,
    scopes,
    ...rest
  } = data;

  const compileTimeCheck: CompileTimeCheck = rest;
  const compileTimeCheckKeys = Object.keys(compileTimeCheck);
  if (compileTimeCheckKeys.length) {
    console.warn("Unwanted data keys: ", compileTimeCheckKeys.join(", "));
  }

  const POSTbody: CreateApiKeyRequestBody = {
    companyId,
    enabled,
    name,
    description,
    scopes: scopes?.length ? scopes.split(",") : [],
  };

  const res = await fetch(apiRoutes.crud.apiKey.index, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(POSTbody satisfies CreateApiKeyRequestBody),
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
      setGlobalError("Failed to create apiKey.");
    }
    setLoading(false);
    return false;
  }
  cancelDialog();
  setLoading(false);
  return true;
};

export const apiKeyUpdateHandler: DialogSubmitHandler<
  ApiKeyDialogFields
> = async (data, props): Promise<boolean> => {
  const { setGlobalError, cancelDialog, setLoading, companyId, token } =
    props || {};

  setLoading(true);

  const {
    clientId: _clientId,
    id,
    enabled,
    name,
    description,
    scopes,
    ...rest
  } = data;

  const compileTimeCheck: CompileTimeCheck = rest;
  const compileTimeCheckKeys = Object.keys(compileTimeCheck);
  if (compileTimeCheckKeys.length) {
    console.warn("Unwanted PATCH data keys: ", compileTimeCheckKeys.join(", "));
  }

  const updateBody: UpdateApiKeyRequestBody = {
    companyId,
    enabled,
    name,
    description,
    scopes: scopes?.length ? scopes.split(",") : [],
  };

  const res = await fetch(apiRoutes.crud.apiKey.id(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateBody satisfies UpdateApiKeyRequestBody),
  });
  if (!res.ok) {
    if (setGlobalError) {
      setGlobalError("Failed to update apiKey.");
    }
    setLoading(false);
    return false;
  }
  cancelDialog();
  setLoading(false);
  return true;
};

export const apiKeysDeleteHandler: DialogDeleteHandler<
  ApiKeyDialogFields
> = async ({
  identifiers,
  companyId,
  setGlobalError,
  token,
}): Promise<boolean> => {
  const res = await fetch(apiRoutes.crud.apiKey.index, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      apiKeyIds: identifiers,
      companyId,
    } satisfies DeleteApiKeyRequestBody),
  });
  if (!res.ok) {
    if (setGlobalError) {
      setGlobalError("Failed to delete apiKey(s).");
    }
    return false;
  }
  return true;
};

export const apiKeyFieldGroups: DialogGroup<ApiKeyDialogFields>[] = [];

function getApiKeyFieldsGrouping(): GroupingProps<ApiKeyDialogFields> {
  const tempGroupedFields = new Set<keyof DialogFields<ApiKeyDialogFields>>();
  const tempUngroupedFields = new Set<keyof DialogFields<ApiKeyDialogFields>>();
  if (apiKeyFieldGroups?.length) {
    apiKeyFieldGroups.forEach((group) => {
      group.keys.forEach((groupKey) => {
        tempGroupedFields.add(groupKey);
      });
    });
    (Object.keys(apiKeyFields) as (keyof typeof apiKeyFields)[]).forEach(
      (fieldKey) => {
        if (!tempGroupedFields.has(fieldKey)) {
          tempUngroupedFields.add(fieldKey);
        }
      },
    );
  }
  return {
    groups: apiKeyFieldGroups,
    ungroupedFields: tempUngroupedFields,
  };
}

export const apiKeyFieldsGrouping = getApiKeyFieldsGrouping();

export default apiKeyFields;
