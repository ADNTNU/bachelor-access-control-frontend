"use client";

import { Box, IconButton, Skeleton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useDrawer } from "@/contexts/DashboardDrawerContext/DashboardDrawerProvider";

export default function DrawerToggleButton() {
  const { isOpen, handleDrawerToggle } = useDrawer();

  if (typeof isOpen === "undefined") {
    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: 18,
            height: 12,
          }}
        />
      </Box>
    );
  }

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
