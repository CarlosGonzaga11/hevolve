import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {  HashRouter } from "react-router-dom";
import { TrainProvider } from "./context/TrainContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
    <AuthProvider>
      <TrainProvider>
        <App />
      </TrainProvider>
    </AuthProvider>
    </HashRouter>
  </StrictMode>
);
