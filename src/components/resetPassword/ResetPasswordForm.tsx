"use client";

import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { routes } from "@/routes";
import { useForm, type SubmitHandler } from "react-hook-form";
import apiRoutes from "@/apiRoutes";
import NextLink from "next/link";

export const passwordTip =
  "Password must be at least 12 characters long, contain at least one uppercase letter, one lowercase letter and one number.";

type FormInput = {
  newPassword: string;
};

type ResetPasswordFormProps = {
  token?: string;
};

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
  const { token } = props;

  const [genericError, setGenericError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const res = await fetch(apiRoutes.auth.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });

      if (res.ok) {
        setSuccess(true);
        setGenericError(null);
      } else if (res.status === 401) {
        setGenericError(
          "Invlid url, it may have expired. Try requesting a new password reset link.",
        );
      } else if (res.status === 400) {
        setError(
          "newPassword",
          { type: "manual", message: passwordTip },
          { shouldFocus: true },
        );
      } else if (res.status === 404) {
        setGenericError("User not found. Please try again.");
      } else {
        setGenericError("Failed to reset password. Please try again.");
      }
    },
    [setError, token],
  );

  return success ? (
    <Stack direction={"column"} gap={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Password Reset Successful
      </Typography>
      <Alert severity="success">
        Your password has been reset successfully.
      </Alert>
      <Link component={NextLink} href={routes.auth.login()} passHref>
        Go to Login
      </Link>
    </Stack>
  ) : (
    <Stack direction={"column"} gap={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Alert severity="error" sx={{ display: genericError ? "block" : "none" }}>
        {genericError}
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <TextField
            aria-label="New Password"
            label="New Password"
            autoComplete="new-password"
            type="password"
            fullWidth
            {...register("newPassword", { required: "Password is required" })}
            error={!!errors.newPassword}
            helperText={
              errors.newPassword ? errors.newPassword.message : undefined
            }
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
