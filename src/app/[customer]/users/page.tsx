"use client";

import { useColorScheme } from "@mui/material";

export default function UsersPage() {

  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <div>
      <h1>Users</h1>
      <select
      value={mode}
      onChange={(event) => {
        setMode(event.target.value as 'light' | 'dark' | 'system');
      }}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
    </div>
  );
}