import ForgotPasswordComponent from "@components/auth/ForgotPasswordComponent";
import { Container } from "@mui/material";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default async function ForgotPasswordPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 3,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordComponent />
      </Suspense>
    </Container>
  );
}
