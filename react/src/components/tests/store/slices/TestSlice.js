import {
    getDefaultMiddleware,
    createSlice,
    current,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
const TestState = {
    tests: [],
    loading: false,
    currentTest: null,
    runningTest: null,
    error: null,
    processes: [],
}

export const getData = createAsyncThunk("Test/getData", (arg) => {
    return axios
        .post("/tests/all", arg)
        .then((res) => res.data);
});

export const updateTest = createAsyncThunk("Test/updateTest", (arg) => {
    return axios
        .post("/tests/update", arg)
        .then((res) => res.data);
});

export const getProcesses = createAsyncThunk("Test/getProcesses", (arg) => {
    return axios
        .post("/tests/getProcesses", arg)
        .then((res) => res.data);
})



export const TestSlice = createSlice({
    name: "Test",
    initialState: TestState,
    reducers: {
        setTests: (state, action) => {
            state.tests = action.payload;
        },
        setCurrentTest: (state, action) => {
            state.currentTest = action.payload;
        },
        setRunningTest: (state, action) => {
            state.runningTest = action.payload;
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
            state.tests = action.payload;
        },
        [updateTest.pending]: (state) => {
            state.loading = true;
        },
        [updateTest.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        [updateTest.fulfilled]: (state, action) => {
            state.loading = false;
            let data = action.payload;
            let tests = current(state.tests);
            let index = tests.findIndex((test) => test.id === data.id);
            if (index == -1) {
                state.tests.push(data);
            }
            state.currentTest = data.id;
            state.tests[index] = data;
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

export const { setTests, setCurrentTest, setRunningTest } = TestSlice.actions;
