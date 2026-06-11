import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </TooltipProvider>
  </StrictMode>,
);
