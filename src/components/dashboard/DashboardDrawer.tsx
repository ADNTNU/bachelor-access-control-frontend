"use client";

import {
  Box,
  Divider,
  List,
  Toolbar,
  Drawer as MuiDrawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import { useDrawer } from "./DashboardDrawerProvider";
import type { ReactNode } from "react";
import PeopleIcon from "@mui/icons-material/People";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { usePathname } from "next/navigation";
import CompanySelect from "./CompanySelect";
import type { Company } from "@models/backend/company";

type NavigationLink = {
  id: string;
  text: string;
  icon: ReactNode;
  segment: string;
};

const navigationLinks: NavigationLink[] = [
  {
    id: "users",
    text: "Users",
    icon: <PeopleIcon />,
    segment: "users",
  },
  {
    id: "api-keys",
    text: "API keys",
    icon: <VpnKeyIcon />,
    segment: "api-keys",
  },
];

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: `calc(${theme.spacing(7)})`,
  // [theme.breakpoints.up("sm")]: {
  //   // width: `calc(${theme.spacing(8)} + 1px)`,
  //   width: `calc(${theme.spacing(9)})`,
  // },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

type DashboardDrawerProps = {
  companyId: string | null;
  companies: Company[];
};

export default function DashboardDrawer(props: DashboardDrawerProps) {
  const { companyId, companies } = props;
  const { isOpen: drawerOpen } = useDrawer();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const basePageSegment = segments[2] ?? "";

  const handleNavigateToCompany = (companyId: string) => {
    window.location.href = `/dashboard/${companyId}/${basePageSegment}`;
  };

  return (
    <Drawer variant="permanent" open={drawerOpen}>
      <Toolbar />
      <Box
        component="nav"
        sx={{
          pt: (theme) => theme.spacing(2),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List disablePadding>
          <Box sx={{ px: 1 }}>
            <CompanySelect
              companies={companies}
              selectedCompanyId={companyId}
              onSelectCompany={(company) => handleNavigateToCompany(company.id)}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          {navigationLinks.map((navigationLink) => (
            <ListItem
              key={navigationLink.id}
              disablePadding
              sx={{ display: "block", px: 1 }}
            >
              <ListItemButton
                LinkComponent={Link}
                href={`/dashboard/${String(companyId ?? "")}/${navigationLink.segment}`}
                selected={basePageSegment === navigationLink.segment}
                sx={{
                  minHeight: 48,
                  py: 1,
                  // px: 1.6,
                  px: 1,
                  borderRadius: 2,
                  justifyContent: drawerOpen ? "initial" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 24,
                    // flexShrink: 0,
                    color:
                      basePageSegment === navigationLink.segment
                        ? "primary.dark"
                        : undefined,
                    mr: drawerOpen ? 1.2 : "auto",
                  }}
                >
                  {navigationLink.icon}
                </ListItemIcon>
                <ListItemText
                  primary={navigationLink.text}
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
