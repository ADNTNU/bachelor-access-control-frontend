import { Container } from "@mui/material";

/**
 * @file api-keys/page.tsx
 * @description This file contains the API keys page for the customer.
 * @returns
 */
export default function ApiKeysPage() {
  return (
    <Container sx={{ padding: 2 }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>Temp API content {index + 1}</div>
      ))}
    </Container>
  );
}
