import LoginComponent from "@components/auth/LoginComponent";
import { Container } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ rd?: string }>;
}) {
  const { rd } = await searchParams;
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
      <LoginComponent onLoginSuccess="redirect" rd={rd} />
    </Container>
  );
}
