import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { TestSlice } from "./slices/TestSlice.js";
import thunk from "redux-thunk";
const middleware = [
    thunk,
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];

// AUTH STATE

const TestReducer = TestSlice.reducer;





export const TestStore = configureStore({
    reducer: {
        Test: TestReducer,
    },
    middleware,
});


