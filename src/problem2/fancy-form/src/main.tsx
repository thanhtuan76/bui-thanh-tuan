import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.scss";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#59a2c9",
    },
    secondary: {
      main: "#0000001F",
      dark: "#E0E0E0",
      light: "#00000099",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1440,
      xl: 2000,
    },
  },
};

const theme = createTheme(themeOptions);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
