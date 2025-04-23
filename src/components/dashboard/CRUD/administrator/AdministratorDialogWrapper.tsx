// "use client";

// import AdminDialogProvider from "@/contexts/AdminDialogContext/AdminDialogProvider";
// import {
//   administratorRowDataToDialogData,
//   type AdministratorDialogFields,
// } from "./administratorFields";
// import type { APIEncode } from "@models/utils";
// import type { AdministratorListDto } from "@models/dto/administrator";
// import type { ReactNode } from "react";

// export default function AdministratorDialogWrapper({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <AdminDialogProvider<
//       AdministratorDialogFields,
//       APIEncode<AdministratorListDto>
//     >
//       rowDataToDialogData={administratorRowDataToDialogData}
//     >
//       {children}
//     </AdminDialogProvider>
//   );
// }
