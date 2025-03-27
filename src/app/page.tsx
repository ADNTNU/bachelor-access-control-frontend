"use client";

import { useColorScheme } from "@mui/material/styles";

export default function Page() {
  const { mode, systemMode} = useColorScheme();

  return (
    <div>
      <h1>Test</h1>
      <p>Access control frontend for bachelor project</p>
      <p>Mode: {mode}</p>
      <p>System mode: {systemMode}</p>
    </div>
  );
}