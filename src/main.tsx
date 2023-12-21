import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as pdfjs from "pdfjs-dist";

const src = new URL("pdfjs-dist/build/pdf.worker.js", import.meta.url);
pdfjs.GlobalWorkerOptions.workerSrc = src.toString();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
