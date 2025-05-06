"use client";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { type WithId } from "@models/utils";
import { type FieldValuesWithId } from "./common";
import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";

export default function EditDialog() {
  const { confirmDialogOpen, confirmConfirmDialog, cancelConfirmDialog } =
    useAdminDialog<FieldValuesWithId, WithId>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => cancelConfirmDialog()}
      maxWidth="md"
    >
      <DialogTitle>Are you sure you want to continue?</DialogTitle>
      <DialogContent sx={{ height: "100%", overflowY: "auto" }}>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Alert severity="warning" variant="outlined">
            All unsaved changes will be lost. Are you sure you want to continue?
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setLoading(false);
            cancelConfirmDialog();
          }}
        >
          No, go back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setLoading(true);
            confirmConfirmDialog();
          }}
          color="warning"
          disabled={loading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
