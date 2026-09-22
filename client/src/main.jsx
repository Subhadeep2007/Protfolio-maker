import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import {
    AuthProvider
} from "./context/AuthContext";

import {
    PortfolioProvider
} from "./context/PortfolioContext";

import "./index.css";


ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <AuthProvider>

            <PortfolioProvider>

                <App />

            </PortfolioProvider>

        </AuthProvider>

    </React.StrictMode>
);