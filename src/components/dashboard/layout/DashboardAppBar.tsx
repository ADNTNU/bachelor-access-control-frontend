"use client";

import { AppBar } from "@mui/material";
import type { ReactNode } from "react";

export default function DashboardAppBar({ children }: { children: ReactNode }) {
  return (
    <AppBar
      position="absolute"
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: (theme) => theme.vars.palette.divider,
        boxShadow: "none",
      }}
    >
      {children}
    </AppBar>
  );
}
