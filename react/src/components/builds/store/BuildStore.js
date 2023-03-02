import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { BuildSlice } from "./slices/BuildSlice.js";

const middleware = [
    ...getDefaultMiddleware(),
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


