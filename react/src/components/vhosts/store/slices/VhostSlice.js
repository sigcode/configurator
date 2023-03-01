import {
    getDefaultMiddleware,
    createSlice,
    current,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
const VhostState = {
    vhosts: [],
    enabled: [],
    consoleContent: "",
    phpversion: "",
    loading: false,
    forceReload: false,
    error: "",
    changedPHPVersion: false,
}

export const getData = createAsyncThunk("Vhost/getData", (arg) => {
    return axios
        .post("/vhosts/vhoststatus", arg)
        .then((res) => res.data);
});
export const getPHPVersion = createAsyncThunk("Vhost/getPHPVersion", (arg) => {
    return axios
        .post("/vhosts/phpversion", arg)
        .then((res) => res.data);
});

export const apacheCtl = createAsyncThunk("Vhost/apacheCtl", (arg) => {
    return axios
        .post("/vhosts/apachectl", arg)
        .then((res) => res.data);
});
export const variousAjax = createAsyncThunk("Vhost/variousAjax", (arg) => {
    return axios
        .post("/vhosts/variousAjax", arg)
        .then((res) => res.data);
});
export const VhostSlice = createSlice({
    name: "Vhost",
    initialState: VhostState,
    reducers: {
        setPHPVersionChanged: (state, action) => {
            state.changedPHPVersion = action.payload;
        },
        appendConsoleContent: (state, action) => {
            state.consoleContent += action.payload;
        },
        setForceReload: (state, action) => {
            state.forceReload = action.payload;
        },
    },
    extraReducers: {
        [getData.pending]: (state) => {
            state.loading = true;
        },
        [getData.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [getData.fulfilled]: (state, action) => {
            state.loading = false;
            state.vhosts = action.payload.available;
            state.enabled = action.payload.enabled;
        },
        [getPHPVersion.pending]: (state) => {
            state.loading = true;
        },
        [getPHPVersion.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [getPHPVersion.fulfilled]: (state, action) => {
            state.loading = false;
            state.phpversion = action.payload;
        },
        [apacheCtl.pending]: (state) => {
            state.consoleContent += "Loading...\n";
            state.loading = true;
        },
        [apacheCtl.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [apacheCtl.fulfilled]: (state, action) => {
            state.loading = false;
            state.consoleContent += action.payload;
        },
        [variousAjax.pending]: (state) => {
            state.consoleContent += "Loading...\n";
            state.loading = true;
        },
        [variousAjax.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [variousAjax.fulfilled]: (state, action) => {
            state.loading = false;
            state.changedPHPVersion = true;
            state.forceReload = true;
            state.consoleContent += action.payload;
        },
    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [],
        },
    }),
});

export const { setPHPVersionChanged, appendConsoleContent, setForceReload } = VhostSlice.actions;
