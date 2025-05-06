import AcceptInviteForm from "@components/acceptInvite/AcceptInviteForm";
import { Container } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import type { Metadata } from "next";

type DecodedToken = {
  sub: string;
  companyId: string;
  adminRegistered: boolean;
  companyName: string;
  tokenType: string;
  iat: number;
  exp: number;
};

export const metadata: Metadata = {
  title: "Accept Invite",
  description: "Accept your invite to join the company",
};

function isInviteToken(token: unknown): token is DecodedToken {
  if (typeof token !== "object" || token === null) {
    return false;
  }

  return (
    "sub" in token &&
    typeof token.sub === "string" &&
    "companyId" in token &&
    typeof token.companyId === "string" &&
    "adminRegistered" in token &&
    typeof token.adminRegistered === "boolean" &&
    "companyName" in token &&
    typeof token.companyName === "string" &&
    "iat" in token &&
    typeof token.iat === "number" &&
    "exp" in token &&
    typeof token.exp === "number"
  );
}

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <div>Invalid invite link</div>;
  }
  const decodedToken = jwtDecode(token);

  if (!isInviteToken(decodedToken)) {
    console.error("Invalid token structure", JSON.stringify(decodedToken));
    return <div>Invalid invite link</div>;
  }

  const isRegistered = decodedToken.adminRegistered;
  const companyName = decodedToken.companyName;
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
      <AcceptInviteForm
        token={token}
        isRegistered={isRegistered}
        companyName={companyName}
      />
    </Container>
  );
}
