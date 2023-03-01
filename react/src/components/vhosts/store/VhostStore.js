import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { VhostSlice } from "./slices/VhostSlice.js";

const middleware = [
	...getDefaultMiddleware(),
	/*YOUR CUSTOM MIDDLEWARES HERE*/
];

// AUTH STATE

const VhostReducer = VhostSlice.reducer;

export const VhostStore = configureStore({
	reducer: {
		Vhost: VhostReducer,
	},
	middleware,
});


