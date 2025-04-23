"use client";

import { getLoginErrorString } from "@server/auth/CredentialSignInErrors";
import { Button, Stack, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormInput = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onLoginSuccess: () => void;
  onLoginFailure: (error: string) => void;
};

/**
 * LoginForm component. Houses all the client side logic for the login form as well as the form itself.
 * This component should be used in the login page or in a modal component.
 */
export function LoginForm(props: LoginFormProps): JSX.Element {
  const { onLoginSuccess, onLoginFailure } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      if (result.code) {
        const error: string = getLoginErrorString(result.code);
        onLoginFailure(error);
      } else {
        console.error("Error has no error code", result);
        onLoginFailure("An unknown error occurred. Please try again later.");
      }
    } else {
      onLoginSuccess();
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={2}>
      <TextField
        {...register("username", { required: true })}
        label="Username"
        variant="outlined"
        fullWidth
        error={!!errors.username}
        helperText={errors.username ? "Username is required" : ""}
        aria-invalid={errors.username ? "true" : "false"}
        aria-errormessage={errors.username ? "username-error" : undefined}
        id="username"
        aria-label="username"
      />
      <TextField
        {...register("password", { required: true })}
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        error={!!errors.password}
        helperText={errors.password ? "Password is required" : ""}
        aria-invalid={errors.password ? "true" : "false"}
        aria-errormessage={errors.password ? "password-error" : undefined}
        id="password"
        aria-label="password"
      />
      <Button type="submit" variant="contained" fullWidth>
        Login
      </Button>
    </Stack>
  );
}
