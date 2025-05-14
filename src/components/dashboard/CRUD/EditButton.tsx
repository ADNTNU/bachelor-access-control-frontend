"use client";

import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import { Button } from "@mui/material";
import { useMemo } from "react";

type EditButtonProps = {
  label?: string;
};
export default function EditButton(props: EditButtonProps) {
  const { label } = props;
  const { selectedRows, editDialogData, openDialog } = useAdminDialog();

  const disabled = useMemo(() => {
    return selectedRows.length !== 1 || editDialogData === null;
  }, [selectedRows, editDialogData]);

  return (
    <Button
      variant="outlined"
      onClick={() => openDialog("edit")}
      disabled={disabled}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      {label ?? "Edit selected"}
    </Button>
  );
}
