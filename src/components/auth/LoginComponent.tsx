"use client";

import { Alert, Box, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { routes } from "@/routes";

type LoginComponentProps = {
  onLoginSuccess: "redirect" | (() => void);
};

export default function LoginComponent(props: LoginComponentProps) {
  const { onLoginSuccess } = props;

  const [genericError, setGenericError] = useState<string | null>(null);

  const router = useRouter();
  const rd = useSearchParams().get("rd");

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      console.log("Already authenticated, redirecting");
      if (rd) {
        const redirectUrl = decodeURIComponent(rd);
        router.replace(redirectUrl);
      } else {
        router.replace(routes.index);
      }
    }
  }, [session.status, rd, router]);

  const handleLoginSuccess = () => {
    console.log("Login success, redirecting");
    if (onLoginSuccess === "redirect") {
      if (rd) {
        router.replace(rd);
      } else {
        router.replace(routes.index);
      }
    } else {
      onLoginSuccess();
    }
  };

  return (
    <Stack direction={"column"} spacing={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Alert severity="error" sx={{ display: genericError ? "block" : "none" }}>
        {genericError}
      </Alert>
      <LoginForm
        onLoginFailure={(error) => setGenericError(error)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Box mt={2}>
        <Link href={routes.auth.forgotPassword}>Forgot Password?</Link>
      </Box>
    </Stack>
  );
}
