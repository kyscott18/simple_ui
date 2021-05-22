import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import {
    Provider as Web3Provider, 
    Updater as Web3Updater,
} from "./contexts/Web3";
import {
    Provider as ElectionProvider, 
    Updater as ElectionUpdater,
} from "./contexts/Election";


ReactDOM.render(
    <React.StrictMode>
        <Web3Provider>
            <ElectionProvider>
                <App />
                <Web3Updater />
                <ElectionUpdater />
            </ElectionProvider>
        </Web3Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
