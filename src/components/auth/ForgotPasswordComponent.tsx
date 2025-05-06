"use client";

import { Alert, Box, Link, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { routes } from "@/routes";

export default function ForgotPasswordComponent() {
  const [genericError, setGenericError] = useState<string | null>(null);
  const [hasSentEmail, setHasSentEmail] = useState(false);

  const router = useRouter();
  const rd = useSearchParams().get("rd");

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      if (rd) {
        const redirectUrl = decodeURIComponent(rd);
        router.replace(redirectUrl);
      } else {
        router.replace(routes.index);
      }
    }
  }, [rd, router, session.status]);

  const handleSuccess = useCallback(() => {
    setHasSentEmail(true);
  }, []);

  const handleError = useCallback((error: string) => {
    setHasSentEmail(false);
    setGenericError(error);
  }, []);

  return (
    <Stack direction={"column"} spacing={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      <Alert severity="error" sx={{ display: genericError ? "block" : "none" }}>
        {genericError}
      </Alert>
      <Alert
        severity="success"
        sx={{ display: hasSentEmail ? "block" : "none" }}
      >
        An email has been sent to your registered email address. Please check
        your inbox.
        <br />
        If you do not see the email, please check your spam folder.
      </Alert>
      <LoginForm onFailure={handleError} onSuccess={handleSuccess} />
      <Box mt={2}>
        <Link href={routes.auth.login(rd, false)}>Go back to login</Link>
      </Box>
    </Stack>
  );
}
