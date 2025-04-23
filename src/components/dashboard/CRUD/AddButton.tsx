"use client";

import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import { Button } from "@mui/material";

type AddButtonProps = {
  label?: string;
};

export default function AddButton(props: AddButtonProps) {
  const { label } = props;
  const { openDialog } = useAdminDialog();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => openDialog("add")}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      {label ?? "Add"}
    </Button>
  );
}
