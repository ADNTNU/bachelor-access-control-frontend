"use client";

import apiRoutes from "@/apiRoutes";
import type { RequestPasswordResetRequestBody } from "@models/dto/auth";
import { Button, Stack, TextField } from "@mui/material";
import { type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormInput = {
  email: string;
};

type ForgotPasswordFormProps = {
  onSuccess: () => void;
  onError: (error: string) => void;
};

/**
 *
 */
export function ForgotPasswordForm(
  props: ForgotPasswordFormProps,
): JSX.Element {
  const { onSuccess, onError } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const response = await fetch(apiRoutes.auth.requestPasswordReset, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        } satisfies RequestPasswordResetRequestBody),
      });

      if (!response.ok) {
        onError(
          "Failed to send reset link. Make sure the email is valid. Please try again.",
        );
        return;
      }

      onSuccess(); // Call the success callback
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError(error.message); // Call the error callback with the error message
      } else {
        onError("An unknown error occurred");
      }
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={2}>
      <TextField
        {...register("email", { required: true })}
        label="Email"
        variant="outlined"
        fullWidth
        error={!!errors.email}
        helperText={errors.email ? "Email is required" : ""}
        aria-invalid={errors.email ? "true" : "false"}
        aria-errormessage={errors.email ? "email-error" : undefined}
        id="email"
        aria-label="email"
      />
      <Button type="submit" variant="contained" fullWidth>
        Send Reset Link
      </Button>
    </Stack>
  );
}
