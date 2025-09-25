import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import React from "react";
import ReactQueryProvider from "./providers/reactQuery";


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
