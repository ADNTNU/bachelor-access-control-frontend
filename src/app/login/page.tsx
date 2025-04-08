import LoginComponent from "@components/auth/LoginComponent";
import { Container } from "@mui/material";
import { Suspense } from "react";

export default function LoginPage() {
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
        <LoginComponent onLoginSuccess="redirect" />
      </Suspense>
    </Container>
  );
}
