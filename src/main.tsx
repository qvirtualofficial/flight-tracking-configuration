import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="sc3-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
