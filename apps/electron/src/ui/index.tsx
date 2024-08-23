import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "ui/App";

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
