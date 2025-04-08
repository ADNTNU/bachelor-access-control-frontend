"use client";

import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useDrawer } from "./DashboardDrawerProvider";

export default function DrawerToggleButton() {
  const { isOpen, handleDrawerToggle } = useDrawer();

  return (
    <IconButton
      color="inherit"
      aria-label={isOpen ? "close drawer" : "open drawer"}
      onClick={handleDrawerToggle}
      // edge="start"
    >
      {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
    </IconButton>
  );
}
