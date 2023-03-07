import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactDOM from "react-dom";
import React from "react";
import Users from "./User.js";
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
        const acl = document.querySelectorAll(".usersReact");

        acl.forEach((el) => {
            const users = JSON.parse(el.getAttribute('data-users'));
            ReactDOM.render(
                <ThemeProvider theme={theme} >
                    <Users users={users} />
                </ThemeProvider>,
                el
            );
        });
    },
    false
);
