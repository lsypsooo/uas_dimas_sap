// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // <- Kita import dari sini
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Dengan membungkus <App /> dengan <AuthProvider />, 
        maka semua komponen di dalam <App /> bisa mengakses
        data `user`, `token`, dan fungsi `login`/`logout`
        melalui hook `useAuth()`.
      */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
