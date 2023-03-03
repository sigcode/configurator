import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, TextField, FormControl, FormControlLabel, FormGroup, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getData, getProcesses, setRunningBuild, updateBuild } from './store/slices/BuildSlice.js';
import Moment from 'moment';
import ConfirmDialog from '../vhosts/components/Dialog.js';
import { DirectionsRun, WarningSharp } from '@mui/icons-material';
import axios from 'axios';
export default function SingleBuild(props) {

    //refs
    const repo_name_ref = useRef();
    const repo_url_ref = useRef();
    const repo_branch_ref = useRef();
    const deployment_path_ref = useRef();
    const build_target_ref = useRef();

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
        build.has_submodules = false;
        build.build_target = '';
        build.build_type = '';

    }
    const dispatch = useDispatch();

    //state
    const [output, setOutput] = useState('');
    const [build_type, setBuildType] = useState(build.build_type);
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
            build_target: build_target_ref.current.value,
            build_type: build_type,
        };
        dispatch(updateBuild(data));
    };

    useEffect(() => {
        if (build.id > 0) {
            dispatch(getProcesses({ id: buildId }));
        }
    }, []);


    const reCheckBuild = () => {
        dispatch(getProcesses({ id: buildId }));
    };

    useEffect(() => {
        let lastProcess = processes[processes.length - 1];
        if (lastProcess != undefined) {
            setOutput(lastProcess.output);
        }
    }, [processes]);

    const run = (id) => {
        dispatch(setRunningBuild(id));
        const data = {
            id: id,
        };
        axios.post('/builds/run', data).then((response) => {
            dispatch(getProcesses({ id: buildId }));
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
                        <TextField id="build_target" label="Build Target" name="build_target" defaultValue={build.build_target} inputRef={build_target_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel id="build_type">Build Type</InputLabel>
                        <Select
                            labelId="build_type"
                            id="build_type"
                            name="build_type"
                            defaultValue={build.build_type}
                            label="Build Type"
                            onChange={(e) => setBuildType(e.target.value)}
                        >
                            <MenuItem value="ant">Ant</MenuItem>
                            <MenuItem value="git">Git</MenuItem>
                        </Select>
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
                                startIcon={<WarningSharp />}
                                color="error"
                                sx={{ marginLeft: "10px" }}
                                buttonText="Delete"
                                title=""
                                variant="contained"
                                content="Delete build?"
                                confirm={() => deleteBuild(build.id)} />
                        </>
                        :
                        <Button variant="contained" onClick={() => update()}>Create</Button>
                    }
                </div>

                {loading ? <p>Loading...</p> :

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

                        <div className="flex flex-row my-5 px-5">
                            <table className="table-auto mr-5">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Started</th>
                                        <th className="px-4 py-2">Finished</th>
                                        <th className="px-4 py-2">Duration</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processes.map((process) => {
                                        let end = Moment(process.finished_at);
                                        let start = Moment(process.started_at);
                                        let duration = Moment.duration(end.diff(start));
                                        return (
                                            <tr key={process.id}>
                                                <td className="border px-4 py-2">{process.id}</td>
                                                <td className="border px-4 py-2">{process.status}</td>
                                                <td className="border px-4 py-2">{Moment(process.started_at).format('DD.MM.YYYY HH:mm:ss')}</td>

                                                <td className="border px-4 py-2">{Moment(process.finished_at).format('DD.MM.YYYY HH:mm:ss')}</td>
                                                <td className="border px-4 py-2">{(duration.asMinutes()).toFixed(2)} minutes</td>
                                                <td className="border px-4 py-2">
                                                    <Button variant="contained" onClick={() => viewOutput(process.output)}>View</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div class="bg-slate-600 text-white p-3 overflow-scroll w-full h-96"  >
                                <pre >
                                    {output}
                                </pre>
                            </div>
                        </div>
                    </div>


                }
            </form>

        </div>
    );

}
