import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  Group,
  MantineProvider,
  Footer,
} from "@mantine/core";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import React, { useState, useEffect, Fragment, Suspense, useRef } from "react";
import { ColorScheme, createStyles, useMantineTheme } from "@mantine/styles";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  MemoryRouter,
} from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import { DeepPartial } from "@mantine/styles/lib/theme/types/DeepPartial";
import Root from "./Root";

function App() {
  const views = [
    { path: "/", name: "Root", exact: true, component: Root },
    { path: "hom", name: "Home", component: Home },
    { path: "settings", name: "Settings", component: Settings },
  ];

  const defaultColorScheme = "dark";
  const [open, setOpen] = useState(false);
  const [colorScheme, setColorScheme] =
    useState<DeepPartial<ColorScheme>>(defaultColorScheme);

  const toggleColorScheme = () => {
    setColorScheme(current => (current === "dark" ? "light" : "dark"));
  };

  const useStyles = createStyles(theme => ({
    navLink: {
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      textDecoration: "none",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
      },
    },
    navLinkActive: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  }));

  const { classes } = useStyles();

  return (
    <MantineProvider
      theme={{ colorScheme, fontFamily: "sans-serif" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <MemoryRouter>
        <AppShell
          padding="md"
          navbarOffsetBreakpoint="sm"
          fixed
          navbar={
            <Navbar width={{ sm: 200 }} hidden={!open} hiddenBreakpoint="sm">
              {views.map(view => (
                <NavLink
                  key={view.path}
                  to={view.path}
                  end={view.exact}
                  className={({ isActive }) =>
                    classes.navLink +
                    " " +
                    (isActive ? classes.navLinkActive : "")
                  }
                  onClick={() => setOpen(false)}
                >
                  <Group>
                    <Text>{view.name}</Text>
                  </Group>
                </NavLink>
              ))}
            </Navbar>
          }
          header={
            <Header height={70} p="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={open}
                    onClick={() => setOpen(!open)}
                    size="sm"
                  />
                </MediaQuery>
                <Text>My first Tauri app</Text>
                <div style={{ marginLeft: "auto" }}>
                  <ActionIcon onClick={toggleColorScheme} variant="default">
                    {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
                  </ActionIcon>
                </div>
              </div>
            </Header>
          }
          footer={
            <Footer
              height={"fit-content"}
              p="xs"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>@takanome-dev</Text>
            </Footer>
          }
          styles={theme => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Routes>
            <Route path="/" element={<Navigate to={views[0].path} />} />
            {views.map((view, index) => (
              <Route
                key={index}
                path={view.path}
                element={<view.component />}
              />
            ))}
          </Routes>
        </AppShell>
      </MemoryRouter>
    </MantineProvider>
  );
}

export default App;
