import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, TextField, FormControl, FormControlLabel, FormGroup, InputLabel, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getData, getProcesses, setRunningBuild, updateBuild } from './store/slices/BuildSlice.js';
import Moment from 'moment';
import ConfirmDialog from '../vhosts/components/Dialog.js';
import { DirectionsRun, Preview, WarningSharp } from '@mui/icons-material';
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
export default function SingleBuild(props) {

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
    const build_key_ref = useRef();
    const post_command_ref = useRef();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        event;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //selectors
    const builds = useSelector((state) => state.Build.builds);
    const processes = useSelector((state) => state.Build.processes);
    const loading = useSelector((state) => state.Build.loading);
    const buildId = useSelector((state) => state.Build.currentBuild);
    const runningBuild = useSelector((state) => state.Build.runningBuild);
    //find build
    let build = builds.find((build) => build.id == buildId);
    if (build == undefined) {
        build = {};
        build.id = 0;
        build.repo_name = '';
        build.repo_url = '';
        build.repo_branch = '';
        build.deployment_path = '';
        build.build_key = '';
        build.has_submodules = false;
        build.post_command = '';

    }
    const dispatch = useDispatch();

    //state
    const [output, setOutput] = useState('');
    const [has_submodules, setHasSubmodules] = useState(build.has_submodules);


    //functions
    const update = () => {
        const data = {
            id: build.id,
            repo_name: repo_name_ref.current.value,
            repo_url: repo_url_ref.current.value,
            repo_branch: repo_branch_ref.current.value,
            deployment_path: deployment_path_ref.current.value,
            has_submodules: has_submodules,
            build_key: build_key_ref.current.value,
            post_command: post_command_ref.current.value,
        };
        dispatch(updateBuild(data));
    };

    useEffect(() => {
        if (build.id > 0) {
            setInterval(() => {
                dispatch(getProcesses({ id: buildId }));
            }, 1000);
        }

    }, []);


    const reCheckBuild = () => {
        dispatch(getProcesses({ id: buildId }));
    };

    const generateKey = (e) => {
        e.preventDefault();
        //hash key
        const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        build_key_ref.current.value = hash;
    }

    const run = (id) => {
        dispatch(setRunningBuild(id));
        const data = {
            id: id,
        };
        axios.post('/builds/run', data).then((response) => {
            // dispatch(getProcesses({ id: buildId }));
            dispatch(setRunningBuild(null));
        });
    }

    const deleteBuild = (id) => {
        const data = {
            id: id,
        };
        axios.post('/builds/delete', data).then((response) => {
            props.back();
        });
    }

    const viewOutput = (process) => {
        setOutput(process);

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
        axios.post('/builds/flushDeploymentPath', data).then((response) => {
            if (response.data.status == 'success') {
                alert('Deployment Path Flushed');
            }
        });
    }


    return (
        <div>
            <Button variant="outlined" onClick={() => props.back()}>Back to Table</Button>
            <h1>Build: {build.repo_name}</h1>

            <form action="/builds" method="POST">
                <input type="hidden" name="id" value={build.id} />
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="name" label="Build Name" name="repo_name" defaultValue={build.repo_name} inputRef={repo_name_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="url" label="Build Repositiory URL" name="repo_url" defaultValue={build.repo_url} inputRef={repo_url_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="branch" label="Build Branch" name="repo_branch" defaultValue={build.repo_branch} inputRef={repo_branch_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="deployment_path" label="Deployment Path " name="deployment_path" defaultValue={build.deployment_path} inputRef={deployment_path_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="build_key" label="Build Key" name="build_key"
                            defaultValue={build.build_key}
                            inputRef={build_key_ref}
                            value={build_key_ref.current ? build_key_ref.current.value : build.build_key}
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
                        <TextField id="build_link" label="Build Link" name="build_link"
                            disabled={true}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                            variant="filled"
                            value={window.location.origin + '/api/builds/hook?key=' + build.build_key}
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
                            name="post_command" defaultValue={build.post_command} inputRef={post_command_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormGroup fullWidth sx={{ m: 1 }}>
                        <FormControlLabel
                            control={<Checkbox id="has_submodules" label="Has Submodules" name="has_submodules" checked={has_submodules} onChange={() => setHasSubmodules(!has_submodules)} />}
                            label="Has Submodules" />
                    </FormGroup>
                </div>

                <div className="flex flex-row my-5">
                    {build.id > 0 ?
                        <>
                            <Button variant="contained" onClick={() => update()}>Save</Button>
                            <ConfirmDialog
                                startIcon={<Delete />}
                                color="error"
                                sx={{ marginLeft: "10px" }}
                                buttonText="Delete"
                                title=""
                                variant="contained"
                                content="Delete build?"
                                confirm={() => deleteBuild(build.id)} />
                            {build.deployment_path !== "" &&
                                <ConfirmDialog
                                    startIcon={<WarningSharp />}
                                    color="error"
                                    sx={{ marginLeft: "10px" }}
                                    buttonText="Flush Deployment Path"
                                    title=""
                                    variant="outlined"
                                    content="Flush deployment path?"
                                    confirm={() => flushDeploymentPath(build.id)} />
                            }
                        </>
                        :
                        <Button variant="contained" onClick={() => update()}>Create</Button>
                    }
                </div>


                <div class="mt-10">
                    <h2>Processes</h2>
                    {runningBuild == build.id ?
                        <>
                            <Button variant="contained" sx={{ marginLeft: "10px" }} disabled>Running</Button>
                            <Button variant="contained" sx={{ marginLeft: "10px" }} onClick={() => reCheckBuild()}>Recheck Build Status</Button>
                        </>
                        :
                        <ConfirmDialog
                            startIcon={<DirectionsRun />}
                            color="secondary"
                            sx={{ marginLeft: "10px" }}
                            buttonText="Run new Build"
                            title=""
                            variant="contained"

                            content="Start new build?"
                            confirm={() => run(build.id)} />}

                    <div className="flex flex-row mx-5 my-5">
                        <>
                            <TableContainer component={Paper} sx={{ marginRight: "20px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                                                size="small" variant="contained" onClick={() => viewOutput(process.output)}>View</Button>
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
                        <div class="bg-slate-600 text-white p-3 overflow-x-clip overflow-y-scroll  w-full " style={{ height: "800px" }} >
                            <pre className="break-words" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                <code>
                                    {output}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>



            </form>

        </div>
    );

}
