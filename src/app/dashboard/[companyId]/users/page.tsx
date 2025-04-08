import { Container } from "@mui/material";

export default function UsersPage() {
  return (
    <Container sx={{ padding: 2 }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>Temp content {index + 1}</div>
      ))}
    </Container>
  );
}
