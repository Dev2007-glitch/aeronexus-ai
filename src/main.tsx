import "./styles.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter();
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

hydrateRoot(
  root,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
