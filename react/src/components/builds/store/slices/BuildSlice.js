import {
    getDefaultMiddleware,
    createSlice,
    current,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
const BuildState = {
    builds: [],
    loading: false,
    error: null,
}

export const getData = createAsyncThunk("Build/getData", (arg) => {
    return axios
        .post("/builds/all", arg)
        .then((res) => res.data);
});

export const updateBuild = createAsyncThunk("Build/updateBuild", (arg) => {
    return axios
        .post("/builds/update", arg)
        .then((res) => res.data);
});
export const BuildSlice = createSlice({
    name: "Build",
    initialState: BuildState,
    reducers: {
        setBuilds: (state, action) => {
            state.builds = action.payload;
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
            state.builds = action.payload.available;
        },
        [updateBuild.pending]: (state) => {
            state.loading = true;
        },
        [updateBuild.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [updateBuild.fulfilled]: (state, action) => {
            state.loading = false;
            let data = action.payload;
            let builds = current(state.builds);
            let index = builds.findIndex((build) => build.id === data.id);
            state.builds[index] = data;
        },

    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [],
        },
    }),
});

export const { setBuilds } = BuildSlice.actions;
