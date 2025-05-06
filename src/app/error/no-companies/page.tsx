import { routes } from "@/routes";
import { Button, Container, Stack, Typography } from "@mui/material";
import { auth } from "@server/auth";
import { revalidateCompaniesCache } from "@server/dashboard/fetchCompanies";
import { redirect } from "next/navigation";

export default async function NoCompaniesErrorPage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect(routes.auth.login(routes.error.noCompanies));
  }

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
          You don&apos;t have access to any companies yet.
        </Typography>
        <Typography variant="body1" component="p" sx={{ textAlign: "center" }}>
          Please contact your administrator to get access to a company.
        </Typography>
        <Typography variant="body1" component="p" sx={{ textAlign: "center" }}>
          If you have just been invited to a company, you can go to the
          dashboard to start managing access.
        </Typography>
        <Stack
          direction="row"
          gap={2}
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            href={routes.dashboard.index}
            sx={{ alignSelf: "center" }}
            onClick={async () => {
              "use server";
              await revalidateCompaniesCache(session.accessToken!);
            }}
          >
            Go to Dashboard
          </Button>
          <Button variant="outlined" href={routes.auth.signOut()}>
            Sign out
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
