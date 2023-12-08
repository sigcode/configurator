import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, TextField, FormControl, FormControlLabel, FormGroup, InputLabel, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getData, getProcesses, setRunningTest, updateTest } from './store/slices/TestSlice.js';
import Moment from 'moment';
import ConfirmDialog from '../vhosts/components/Dialog.js';
import { DirectionsRun, Preview, WarningSharp, Storage } from '@mui/icons-material';
import { Casino, Delete } from '@mui/icons-material';
import axios from 'axios';
import Status from './components/Status.js';
import { Stack } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default function SingleTest(props) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    //refs
    const repo_name_ref = useRef();
    const repo_url_ref = useRef();
    const repo_branch_ref = useRef();
    const deployment_path_ref = useRef();
    const test_key_ref = useRef();
    const post_command_ref = useRef();
    const test_command_ref = useRef();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        event;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //selectors
    const tests = useSelector((state) => state.Test.tests);
    const processes = useSelector((state) => state.Test.processes);
    const loading = useSelector((state) => state.Test.loading);
    const testId = useSelector((state) => state.Test.currentTest);
    const runningTest = useSelector((state) => state.Test.runningTest);
    //find test
    let test = tests.find((test) => test.id == testId);
    if (test == undefined) {
        test = {};
        test.id = 0;
        test.repo_name = '';
        test.repo_url = '';
        test.repo_branch = '';
        test.deployment_path = '';
        test.test_key = '';
        test.has_submodules = false;
        test.post_command = '';

    }
    const dispatch = useDispatch();

    //state
    const [output, setOutput] = useState('');


    //functions
    const update = () => {
        const data = {
            id: test.id,
            repo_name: repo_name_ref.current.value,
            repo_url: repo_url_ref.current.value,
            repo_branch: repo_branch_ref.current.value,
            deployment_path: deployment_path_ref.current.value,
            test_key: test_key_ref.current.value,
            post_command: post_command_ref.current.value,
            test_command: test_command_ref.current.value,
        };
        dispatch(updateTest(data));
    };

    useEffect(() => {
        if (test.id > 0) {
            setInterval(() => {
                dispatch(getProcesses({ id: testId }));
            }, 1000);
        }

    }, []);


    const reCheckTest = () => {
        dispatch(getProcesses({ id: testId }));
    };

    const generateKey = (e) => {
        e.preventDefault();
        //hash key
        const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        test_key_ref.current.value = hash;
    }

    const run = (id) => {
        dispatch(setRunningTest(id));
        const data = {
            id: id,
        };
        axios.post('/tests/run', data).then((response) => {
            // dispatch(getProcesses({ id: testId }));
            dispatch(setRunningTest(null));
        });
    }

    const runTest = (id) => {
        dispatch(setRunningTest(id));
        const data = {
            id: id,
        };
        axios.post('/tests/runTest', data).then((response) => {
            // dispatch(getProcesses({ id: testId }));
            dispatch(setRunningTest(null));
        });
    }
    const deleteTest = (id) => {
        const data = {
            id: id,
        };
        axios.post('/tests/delete', data).then((response) => {
            props.back();
        });
    }

    const viewOutput = (process) => {
        setOutput(process);

    }

    const viewResult = (process, test) => {
        let id = process.id;
        const result_path = "https://" + test.deployment_path.replace("var/www/", "") + ".sguenther.codesrv.it/bundles/" + id + "/mochawesome-report/mochawesome.html";
        window.open(result_path, '_blank');
    }




    const deleteProcess = (id) => {
        const data = {
            id: id,
        };
        axios.post('/processes/delete', data).then((response) => {
        });
    }

    const flushDeploymentPath = (id) => {
        const data = {
            id: id,
        };
        axios.post('/tests/flushDeploymentPath', data).then((response) => {
            if (response.data.status == 'success') {
                alert('Deployment Path Flushed');
            }
        });
    }


    return (
        <div>
            <Button variant="outlined" onClick={() => props.back()}>Back to Table</Button>
            <h1>Test: {test.repo_name}</h1>

            <form action="/tests" method="POST">
                <input type="hidden" name="id" value={test.id} />
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="name" label="Test Name" name="repo_name" defaultValue={test.repo_name} inputRef={repo_name_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="url" label="Test Repositiory URL" name="repo_url" defaultValue={test.repo_url} inputRef={repo_url_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="branch" label="Test Branch" name="repo_branch" defaultValue={test.repo_branch} inputRef={repo_branch_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="deployment_path" label="Deployment Path " name="deployment_path" defaultValue={test.deployment_path} inputRef={deployment_path_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="test_key" label="Test Key" name="test_key"
                            defaultValue={test.test_key}
                            inputRef={test_key_ref}
                            value={test_key_ref.current ? test_key_ref.current.value : test.test_key}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="outlined"
                                            onClick={(e) => generateKey(e)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                        >
                                            <Casino /> Generate
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5 bg-white-100">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="test_link" label="Test Link" name="test_link"
                            disabled={true}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                            variant="filled"
                            value={window.location.origin + '/api/tests/hook?key=' + test.test_key}
                            inputProps={{
                                style: { color: 'black', fontWeight: 'bold', backgroundColor: 'white', textAlign: 'center' },
                            }}
                            InputProps={{
                                LabelProps: {
                                    style: { color: 'black', fontWeight: 'bold', backgroundColor: 'white', textAlign: 'center' },
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="post_command" label="Post Command"
                            multiline
                            rows={4}
                            name="post_command" defaultValue={test.post_command} inputRef={post_command_ref} />
                    </FormControl>
                </div>

                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="test_command" label="Test Command"
                            multiline
                            rows={4}
                            name="test_command" defaultValue={test.test_command} inputRef={test_command_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    {test.id > 0 ?
                        <>
                            <Button variant="contained" onClick={() => update()}>Save</Button>
                            <ConfirmDialog
                                startIcon={<Delete />}
                                color="error"
                                sx={{ marginLeft: "10px" }}
                                buttonText="Delete"
                                title=""
                                variant="contained"
                                content="Delete test?"
                                confirm={() => deleteTest(test.id)} />
                            {test.deployment_path !== "" &&
                                <ConfirmDialog
                                    startIcon={<WarningSharp />}
                                    color="error"
                                    sx={{ marginLeft: "10px" }}
                                    buttonText="Flush Deployment Path"
                                    title=""
                                    variant="outlined"
                                    content="Flush deployment path?"
                                    confirm={() => flushDeploymentPath(test.id)} />
                            }
                        </>
                        :
                        <Button variant="contained" onClick={() => update()}>Create</Button>
                    }
                </div>


                <div class="mt-10">
                    <h2>Processes</h2>
                    {runningTest == test.id ?
                        <>
                            <Button variant="contained" sx={{ marginLeft: "10px" }} disabled>Running</Button>
                            <Button variant="contained" sx={{ marginLeft: "10px" }} onClick={() => reCheckTest()}>Recheck Test Status</Button>
                        </>
                        :
                        <div class="flex flex-row">
                            <ConfirmDialog
                                startIcon={<Storage />}
                                color="secondary"
                                sx={{ marginLeft: "10px" }}
                                buttonText="Run Test Deployment"
                                title=""
                                variant="contained"

                                content="Start Deployment?"
                                confirm={() => run(test.id)} />

                            <ConfirmDialog
                                startIcon={<DirectionsRun />}
                                color="secondary"
                                sx={{ marginLeft: "10px" }}
                                buttonText="Run Test"
                                title=""
                                variant="contained"

                                content="Start Test?"
                                confirm={() => runTest(test.id)} />

                        </div>}

                    <div className="flex flex-row mx-5 my-5">
                        <>
                            <TableContainer component={Paper} sx={{ marginRight: "20px" }}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell >ID</StyledTableCell>
                                            <StyledTableCell >Status</StyledTableCell>
                                            <StyledTableCell >Started</StyledTableCell>
                                            <StyledTableCell >Finished</StyledTableCell>
                                            <StyledTableCell >Duration</StyledTableCell>
                                            <StyledTableCell >Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {processes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((process) => {
                                            let end = Moment(process.finished_at);
                                            let start = Moment(process.started_at);
                                            let duration = Moment.duration(end.diff(start));
                                            return (
                                                <tr key={process.id}>
                                                    <td className="border px-4 py-2">{process.id}</td>
                                                    <td className="border px-4 py-2"><Status status={process.status} /></td>
                                                    <td className="border px-4 py-2">{process.started_at !== null ? Moment(process.started_at).format('DD.MM.YYYY HH:mm:ss') : ""}</td>

                                                    <td className="border px-4 py-2">{process.finished_at !== null ? Moment(process.finished_at).format('DD.MM.YYYY HH:mm:ss') : ""}</td>
                                                    <td className="border px-4 py-2">{process.finished_at !== null ? (duration.asMinutes()).toFixed(2) + " Minutes" : ""} </td>
                                                    <td className="border px-4 py-2">
                                                        <Stack direction="column" spacing={2}>
                                                            <Button
                                                                sx={{ marginLeft: "10px" }}
                                                                startIcon={<Preview />}
                                                                size="small" variant="contained" onClick={() => viewOutput(process.output)}>Log</Button>
                                                            <Button
                                                                sx={{ marginLeft: "10px" }}
                                                                startIcon={<Preview />}
                                                                size="small" variant="contained" onClick={() => viewResult(process, test)}> Result</Button>
                                                            <ConfirmDialog
                                                                startIcon={<Delete />}
                                                                color="error"
                                                                sx={{ marginLeft: "10px" }}
                                                                buttonText="Delete"
                                                                title=""
                                                                variant="contained"
                                                                size="small"
                                                                content="Delete process?"
                                                                confirm={() => deleteProcess(process.id)} />
                                                        </Stack>

                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    sx={{
                                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                            margin: '0',
                                            justifyContent: 'center',
                                        },
                                    }}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={processes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        </>
                        <Paper elevation={1} className=" text-white p-3  w-full " style={{ height: "500" }} >
                            <pre className="break-words overflow-y-auto" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                <code>
                                    {output}
                                </code>
                            </pre>

                        </Paper>
                    </div>
                </div>



            </form>

        </div>
    );

}
