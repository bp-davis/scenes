import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Root } from "./renderer/Root";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Root />} />
            </Routes>
        </Router>
    );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
