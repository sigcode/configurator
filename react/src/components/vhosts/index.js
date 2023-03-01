import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactDOM from "react-dom";
import React from "react";
import Vhosts from "./Vhosts.js";
import { VhostStore } from "./store/VhostStore.js";
import { Provider } from "react-redux";
const theme = createTheme({
    palette: {
        primary: {
            light: "#757ce8",
            main: "#1BA689",
            dark: "#243747",
            contrastText: "#fff",
            error: "#ba000d",
        },
        secondary: {
            light: "#ff7961",
            main: "#F5F5F6",
            dark: "#FFFFFF",
            contrastText: "#000",
        },
        tertiary: {
            light: "#ff7961",
            main: "#243747",
            dark: "#415A70",
            contrastText: "#fff",
        }
    },
});
window.addEventListener(
    "load",
    () => {
        const acl = document.querySelectorAll(".vhostsReact");

        acl.forEach((el) => {
            const vhosts = JSON.parse(el.getAttribute('data-vhosts'));
            const enabled = JSON.parse(el.getAttribute('data-enabled'));
            ReactDOM.render(
                <ThemeProvider theme={theme} >
                    <Provider store={VhostStore}>
                        <Vhosts vhosts={vhosts} enabled={enabled} />
                    </Provider>
                </ThemeProvider>,
                el
            );
        });
    },
    false
);

