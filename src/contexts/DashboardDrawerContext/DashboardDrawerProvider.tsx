"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type DashboardDrawerContextType = {
  isOpen: boolean | undefined;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  handleDrawerToggle: () => void;
};

const DashboardDrawerContext = createContext<
  DashboardDrawerContextType | undefined
>(undefined);

const LOCAL_STORAGE_KEY = "dashboard-drawer-open";

export default function DashboardDrawerProvider({
  children,
  defaultOpen = true,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored !== null) {
      setOpen(stored === "true");
    } else {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  // When open changes, save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, String(open));
    }
  }, [open]);

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
