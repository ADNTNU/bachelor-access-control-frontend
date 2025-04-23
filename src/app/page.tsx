"use client";

import { routes } from "@/routes";
import ThemeSwitcher from "@components/theme/ThemeSwitcher";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const { mode, systemMode } = useColorScheme();
  const session = useSession();

  return (
    <Stack direction="column" sx={{ height: "100vh", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Access control frontend for bachelor project
      </Typography>
      <Typography variant="h6" gutterBottom>
        Current mode: {mode}
      </Typography>
      <Typography variant="h6" gutterBottom>
        System mode: {systemMode}
      </Typography>
      <Box sx={{ pt: 2 }}>
        <ThemeSwitcher />
      </Box>
      <Box sx={{ pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Session:
        </Typography>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </Box>
      {session.status === "authenticated" ? (
        <>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              User:
            </Typography>
            <pre>{JSON.stringify(session.data.user, null, 2)}</pre>
          </Box>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sign out
            </Typography>
            <Button onClick={() => signOut()}>Sign out</Button>
          </Box>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Go to dashboard
            </Typography>
            <Button href={routes.dashboard.index}>Dashboard</Button>
          </Box>
        </>
      ) : (
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Not signed in
          </Typography>
          <Button href={routes.auth.login()}>Sign in</Button>
        </Box>
      )}
    </Stack>
  );
}
