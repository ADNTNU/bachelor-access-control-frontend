"use client";

import apiRoutes from "@/apiRoutes";
import { routes } from "@/routes";
import { passwordTip } from "@components/resetPassword/ResetPasswordForm";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormProps = {
  companyName: string;
  setError: Dispatch<SetStateAction<string | null>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  token: string;
};

type FormInputRegister = {
  inviteToken: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

function RegistrationForm({
  companyName,
  setError,
  setSuccess,
  token,
}: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputRegister>();

  const submitHandler: SubmitHandler<FormInputRegister> = async (data) => {
    try {
      const res = await fetch(apiRoutes.administrator.registerFromInvite, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteToken: token,
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid URL. Ask the admin to resend the invite.");
        } else if (res.status === 400) {
          setError("Invalid data. Please check your input and try again.");
        } else {
          setError(
            "Something went wrong. Please try again later. If the problem persists, contact support.",
          );
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setError(
        "Something went wrong. Please try again later. If the problem persists, contact support.",
      );
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(submitHandler)} gap={2}>
      <Typography>
        You have been invited to join &quot;<strong>{companyName}</strong>
        &quot;. Please fill in the form below to create your account and accept
        the invite.
      </Typography>
      <TextField
        {...register("username", { required: true })}
        label="Username"
        aria-label="Username"
        error={!!errors.username}
        helperText={errors.username ? "Username is required" : ""}
        variant="outlined"
        autoComplete="new-username"
      />
      <TextField
        {...register("password", { required: true })}
        label="Password"
        type="password"
        aria-label="Password"
        error={!!errors.password}
        helperText={errors.password ? passwordTip : ""}
        variant="outlined"
        autoComplete="new-password"
      />
      <TextField
        {...register("firstName", { required: true })}
        label="First Name"
        aria-label="First Name"
        error={!!errors.firstName}
        helperText={errors.firstName ? "First name is required" : ""}
        variant="outlined"
        autoComplete="given-name"
      />
      <TextField
        {...register("lastName", { required: true })}
        label="Last Name"
        aria-label="Last Name"
        error={!!errors.lastName}
        helperText={errors.lastName ? "Last name is required" : ""}
        variant="outlined"
        autoComplete="family-name"
      />
      <Button variant="contained" type="submit">
        Create Account and Accept Invitation
      </Button>
    </Stack>
  );
}

function AcceptForm({ companyName, setError, setSuccess, token }: FormProps) {
  const onSubmit = async () => {
    try {
      setError(null);
      const res = await fetch(apiRoutes.administrator.acceptInvite, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteToken: token,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid URL. Ask the admin to resend the invite.");
        } else {
          setError(
            "Something went wrong. Please try again later. If the problem persists, contact support.",
          );
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setError(
        "Something went wrong. Please try again later. If the problem persists, contact support.",
      );
    }
  };

  return (
    <Stack component="form" onSubmit={onSubmit} gap={2}>
      <Typography>
        You have been invited to join {companyName}. Please click the button
        below to accept the invite.
      </Typography>
      <Button variant="contained" type="submit">
        Accept Invitation
      </Button>
    </Stack>
  );
}

type AcceptInviteFormProps = {
  token: string;
  isRegistered: boolean;
  companyName: string;
};

export default function AcceptInviteForm(props: AcceptInviteFormProps) {
  const { token, isRegistered, companyName } = props;
  const [genericError, setGenericError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  return (
    <Stack gap={2} width="100%">
      {genericError && <Alert severity="error">{genericError}</Alert>}
      {success ? (
        <>
          <Typography variant="h5" gutterBottom>
            Invitation accepted! You can now log in to your account.
          </Typography>
          <Button variant="contained" href={routes.auth.login()}>
            Go to login
          </Button>
        </>
      ) : isRegistered ? (
        <AcceptForm
          token={token}
          setError={setGenericError}
          setSuccess={setSuccess}
          companyName={companyName}
        />
      ) : (
        <RegistrationForm
          token={token}
          setError={setGenericError}
          setSuccess={setSuccess}
          companyName={companyName}
        />
      )}
    </Stack>
  );
}
