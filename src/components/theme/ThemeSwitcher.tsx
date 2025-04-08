"use client";

import { MenuItem, Select, useColorScheme } from "@mui/material";

export default function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <Select
      value={mode}
      onChange={(event) => {
        setMode(event.target.value as "light" | "dark" | "system");
      }}
      label="Theme"
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
