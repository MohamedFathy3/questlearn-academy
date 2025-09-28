import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { AuthProvider } from "@/context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>

      <App />
          </AuthProvider>

    </ThemeProvider>
  </StrictMode>,
);
