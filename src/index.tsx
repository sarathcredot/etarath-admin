import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import React from "react";
import ReactQueryProvider from "./providers/reactQuery";

// Override ResizeObserver to prevent runtime errors in modals / pickers
const OriginalResizeObserver = window.ResizeObserver;

window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      try {
        callback(entries, observer);
      } catch (err) {
        // Silently catch errors to prevent runtime crashes
        console.warn("ResizeObserver caught error:", err);
      }
    });
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <App />
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("app")
);
