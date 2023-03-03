import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { BuildSlice } from "./slices/BuildSlice.js";
import thunk from "redux-thunk";
const middleware = [
    thunk,
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];

// AUTH STATE

const BuildReducer = BuildSlice.reducer;





export const BuildStore = configureStore({
    reducer: {
        Build: BuildReducer,
    },
    middleware,
});


