"use client";

import useAdminDialog from "@/contexts/AdminDialogContext/useAdminDialog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, type ReactNode } from "react";

export const CLIENT_ID_SECRET_DIALOG_KEY = "clientIdSecretDialog";
export type ClientIdSecretDialogData = {
  clientId: string;
  clientSecret: string;
};

export function isClientIdSecretDialogData(
  data: unknown,
): data is ClientIdSecretDialogData {
  return (
    typeof data === "object" &&
    data !== null &&
    "clientId" in data &&
    typeof data.clientId === "string" &&
    "clientSecret" in data &&
    typeof data.clientSecret === "string"
  );
}

export function ClientIdSecretDialog() {
  const { customDialogsData, customDialogsOpen, closeCurrentDialog } =
    useAdminDialog();

  const data = customDialogsData[CLIENT_ID_SECRET_DIALOG_KEY];
  const open = customDialogsOpen[CLIENT_ID_SECRET_DIALOG_KEY];

  const content: ReactNode = useMemo(() => {
    if (isClientIdSecretDialogData(data)) {
      return (
        <Stack gap={1}>
          <Typography>
            Copy the client secret now, as it won&apos;t be shown again.
          </Typography>
          <Stack gap={1}>
            <Typography variant="h6">Client ID</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={data.clientId}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="h6">Client Secret</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={data.clientSecret}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Stack>
        </Stack>
      );
    } else {
      return <p>No data available</p>;
    }
  }, [data]);

  return (
    <Dialog
      open={open ?? false}
      onClose={() => {
        closeCurrentDialog();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Client ID and Secret</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            closeCurrentDialog();
          }}
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
