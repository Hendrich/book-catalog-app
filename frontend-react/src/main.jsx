import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Mendeklarasikan apiUrl dari environment variable
export const apiUrl = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
