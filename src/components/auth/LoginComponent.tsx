"use client";

import { Alert, Box, Link, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { useSession } from "next-auth/react";
import { routes } from "@/routes";
import { useRouter } from "next/navigation";

type LoginComponentProps = {
  onLoginSuccess: "redirect" | (() => void);
  rd?: string;
};

export default function LoginComponent(props: LoginComponentProps) {
  const { onLoginSuccess, rd } = props;

  const [genericError, setGenericError] = useState<string | null>(null);
  const router = useRouter();

  const session = useSession();

  const handleLoginSuccess = useCallback(() => {
    // console.log("Login success, redirecting");
    if (onLoginSuccess === "redirect") {
      if (rd) {
        const redirectUrl = decodeURIComponent(rd);
        router.replace(redirectUrl);
      } else {
        router.replace(routes.index);
      }
    } else {
      onLoginSuccess();
    }
  }, [onLoginSuccess, rd, router]);

  useEffect(() => {
    if (session.status === "authenticated") {
      handleLoginSuccess();
    }
  }, [session.status, handleLoginSuccess]);

  return (
    <Stack direction={"column"} spacing={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Alert severity="error" sx={{ display: genericError ? "block" : "none" }}>
        {genericError}
      </Alert>
      <LoginForm
        onFailure={(error) => setGenericError(error)}
        onSuccess={handleLoginSuccess}
      />
      <Box mt={2}>
        <Link href={routes.auth.forgotPassword}>Forgot Password?</Link>
      </Box>
    </Stack>
  );
}
