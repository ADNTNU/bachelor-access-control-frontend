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
  type ListItemButtonProps,
  type ListItemButtonTypeMap,
} from "@mui/material";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import { useDrawer } from "./DashboardDrawerProvider";
import { useCallback, type ReactNode } from "react";
import PeopleIcon from "@mui/icons-material/People";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { usePathname, useRouter } from "next/navigation";
import CompanySelect from "./CompanySelect";
import type { Company } from "@models/backend/company";
import { routes } from "@/routes";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

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

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "$drawerOpen",
})<ListItemButtonProps & { $drawerOpen: boolean }>(
  ({ theme, $drawerOpen }) => ({
    minHeight: 48,
    padding: theme.spacing(1, 1),
    borderRadius: theme.shape.borderRadius * 2,
    justifyContent: $drawerOpen ? "initial" : "center",
  }),
) as OverridableComponent<ListItemButtonTypeMap<{ $drawerOpen: boolean }>>;

export const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "$drawerOpen" && prop !== "$selected",
})<{ $drawerOpen: boolean; $selected?: boolean }>(
  ({ theme, $drawerOpen, $selected }) => ({
    minWidth: 24,
    // flexShrink: 0,
    color: $selected ? theme.palette.primary.dark : undefined,
    marginRight: $drawerOpen ? theme.spacing(1.2) : "auto",
  }),
);

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "$drawerOpen",
})<{ $drawerOpen: boolean }>(({ $drawerOpen }) => ({
  opacity: $drawerOpen ? 1 : 0,
}));

type DashboardDrawerProps = {
  companyId: string | null;
  companies: Company[];
};

export default function DashboardDrawer(props: DashboardDrawerProps) {
  const { companyId, companies } = props;
  const { isOpen: drawerOpen } = useDrawer();

  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const basePageSegment = segments[-1] ?? "";

  const handleNavigateToCompany = useCallback(
    (companyId: string) => {
      router.push(`${routes.dashboard.home(companyId)}/${basePageSegment}`);
    },
    [router, basePageSegment],
  );

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
        <Box sx={{ px: 1 }}>
          <CompanySelect
            companies={companies}
            selectedCompanyId={companyId}
            onSelectCompany={(company) => handleNavigateToCompany(company.id)}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <List disablePadding>
          {navigationLinks.map((navigationLink) => (
            <ListItem
              key={navigationLink.id}
              disablePadding
              sx={{ display: "block", px: 1 }}
            >
              <StyledListItemButton
                component={Link}
                href={`/dashboard/${String(companyId ?? "")}/${navigationLink.segment}`}
                selected={basePageSegment === navigationLink.segment}
                $drawerOpen={drawerOpen}
              >
                <StyledListItemIcon
                  $selected={basePageSegment === navigationLink.segment}
                  $drawerOpen={drawerOpen}
                >
                  {navigationLink.icon}
                </StyledListItemIcon>
                <StyledListItemText
                  primary={navigationLink.text}
                  $drawerOpen={drawerOpen}
                />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
