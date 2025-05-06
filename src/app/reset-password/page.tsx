import ResetPasswordForm from "@components/resetPassword/ResetPasswordForm";
import { Container } from "@mui/material";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
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
      <ResetPasswordForm token={token} />
    </Container>
  );
}
