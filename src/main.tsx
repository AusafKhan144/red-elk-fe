import React from "react";
import ReactDOM from "react-dom/client";
import {MantineProvider} from "@mantine/core";
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider} from "antd";

import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css"; // 👈 AntD reset (before your own styles)
import "./index.css";         // 👈 Tailwind
import "./styles/global.css"; // 👈 Your overrides

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MantineProvider>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#2563eb", // Tailwind blue-600
                    },
                }}
            >
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ConfigProvider>
        </MantineProvider>
    </React.StrictMode>
);
