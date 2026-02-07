import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Web3Provider } from "./context/Web3Context";
import "./index.css";
import "./styles/theme.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </StrictMode>,
);
