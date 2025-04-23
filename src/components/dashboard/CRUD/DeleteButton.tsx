"use client";

import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import { Button } from "@mui/material";
import { useMemo } from "react";

type DeleteButtonProps = {
  label?: string;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const { label } = props;
  const { selectedRows, openDialog } = useAdminDialog();

  const disabled = useMemo(() => {
    return selectedRows.length === 0;
  }, [selectedRows]);

  return (
    <Button
      variant="text"
      color="error"
      onClick={() => openDialog("delete")}
      disabled={disabled}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      {label ?? "Delete selected"}
    </Button>
  );
}
