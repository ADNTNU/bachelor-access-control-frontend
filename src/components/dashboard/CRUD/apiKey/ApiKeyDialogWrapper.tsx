// "use client";

// import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
// import {
//   apiKeyRowDataToDialogData,
//   type ApiKeyDialogFields,
// } from "./apiKeyFields";
// import type { APIEncode } from "@models/utils";
// import type { ApiKeyListDto } from "@models/dto/apiKey";
// import type { ReactNode } from "react";

// export default function ApiKeyDialogWrapper({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <AdminDialogProvider<ApiKeyDialogFields, APIEncode<ApiKeyListDto>>
//       rowDataToDialogData={apiKeyRowDataToDialogData}
//     >
//       {children}
//     </AdminDialogProvider>
//   );
// }
