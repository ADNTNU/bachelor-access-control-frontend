"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DashboardDrawerContextType = {
  isOpen: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  handleDrawerToggle: () => void;
};

const DashboardDrawerContext = createContext<
  DashboardDrawerContextType | undefined
>(undefined);

export default function DashboardDrawerProvider({
  children,
  defaultOpen = true,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <DashboardDrawerContext.Provider
      value={{
        isOpen: open,
        handleDrawerOpen,
        handleDrawerClose,
        handleDrawerToggle,
      }}
    >
      {children}
    </DashboardDrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DashboardDrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}
