"use client";

import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useState, type ReactNode } from "react";
import { usePathname, useParams } from "next/navigation";
import { Link, ThemeProvider } from "@mui/material";
import theme from "@material/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

const drawerWidth = 320;

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
  [theme.breakpoints.up("sm")]: {
    // width: `calc(${theme.spacing(8)} + 1px)`,
    width: `calc(${theme.spacing(8)})`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const pathname = usePathname();
  const { customer } = useParams();
  const segments = pathname.split("/").filter(Boolean);
  const basePageSegment = segments[1] ?? "";

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <InitColorSchemeScript attribute="data-color-scheme" />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
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
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label={drawerOpen ? "close drawer" : "open drawer"}
              onClick={handleToggleDrawer}
              edge="start"
              sx={[
                {
                  marginRight: 2,
                },
              ]}
            >
              {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
              Horizon access control
            </Typography>
          </Toolbar>
        </AppBar>
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
              {navigationLinks.map((navigationLink) => (
                <ListItem
                  key={navigationLink.id}
                  disablePadding
                  sx={{ display: "block", px: 1 }}
                >
                  <ListItemButton
                    LinkComponent={Link}
                    href={`/${String(customer ?? "")}/${navigationLink.segment}`}
                    selected={basePageSegment === navigationLink.segment}
                    sx={{
                      minHeight: 48,
                      py: 1,
                      px: 1.4,
                      borderRadius: 2,
                      justifyContent: drawerOpen ? "initial" : "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 34,
                        justifyContent: "center",
                        color:
                          basePageSegment === navigationLink.segment
                            ? "primary.dark"
                            : undefined,
                        mr: drawerOpen ? 2 : "auto",
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
