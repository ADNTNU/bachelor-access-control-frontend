import LoginComponent from "@components/auth/LoginComponent";
import { Container } from "@mui/material";

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
      <LoginComponent onLoginSuccess="redirect" />
    </Container>
  );
}
