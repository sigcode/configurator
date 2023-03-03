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
    currentBuild: null,
    error: null,
    processes: [],
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

export const getProcesses = createAsyncThunk("Build/getProcesses", (arg) => {
    return axios
        .post("/builds/getProcesses", arg)
        .then((res) => res.data);
})

export const BuildSlice = createSlice({
    name: "Build",
    initialState: BuildState,
    reducers: {
        setBuilds: (state, action) => {
            state.builds = action.payload;
        },
        setCurrentBuild: (state, action) => {
            state.currentBuild = action.payload;
        }

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
            state.builds = action.payload;
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
            if (index == -1) {
                state.builds.push(data);
            }
            state.currentBuild = data.id;
            state.builds[index] = data;
        },
        [getProcesses.pending]: (state) => {
            state.loading = true;
        },
        [getProcesses.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [getProcesses.fulfilled]: (state, action) => {
            state.loading = false;
            state.processes = action.payload;
        }


    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [],
        },
    }),
});

export const { setBuilds, setCurrentBuild } = BuildSlice.actions;
