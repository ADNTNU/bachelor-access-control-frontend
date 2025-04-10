import { routes } from "@/routes";
import { Button, Container, Stack, Typography } from "@mui/material";

export default async function UnauthorizedErrorPage({
  params,
}: {
  params: Promise<{ rd?: string }>;
}) {
  const { rd } = await params;

  const redirectUrl = rd ? decodeURIComponent(rd) : null;
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Stack gap={2} sx={{ padding: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", marginTop: 2 }}
        >
          You are not authorized to access this page.
        </Typography>
        <Typography variant="body1" component="p" sx={{ textAlign: "center" }}>
          Please contact your administrator to get access to this page.
        </Typography>
        <Typography variant="body1" component="p" sx={{ textAlign: "center" }}>
          If you think this is a mistake, please try again later.
        </Typography>
        {redirectUrl && (
          <Button
            variant="contained"
            color="primary"
            href={redirectUrl}
            sx={{ alignSelf: "center", marginTop: 2 }}
          >
            Try Again
          </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          href={routes.index}
          sx={{ alignSelf: "center", marginTop: 2 }}
        >
          Go to Home
        </Button>
      </Stack>
    </Container>
  );
}
