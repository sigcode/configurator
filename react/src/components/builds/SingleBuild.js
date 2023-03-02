import React, { useRef } from 'react';
import { Button, Checkbox, TextField, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateBuild } from './store/slices/BuildSlice.js';
export default function SingleBuild(props) {
    const buildId = props.id;
    const repo_name_ref = useRef();
    const repo_url_ref = useRef();
    const repo_branch_ref = useRef();
    const deployment_path_ref = useRef();
    const has_submodules_ref = useRef();
    const builds = useSelector((state) => state.Build.builds);
    console.log(builds);
    const build = builds.find((build) => build.id == buildId);
    const dispatch = useDispatch();
    const update = (e) => {
        const data = {
            id: build.id,
            repo_name: repo_name_ref.current.value,
            repo_url: repo_url_ref.current.value,
            repo_branch: repo_branch_ref.current.value,
            deployment_path: deployment_path_ref.current.value,
            has_submodules: has_submodules_ref.current.checked,
        };
        dispatch(updateBuild(data));
    };

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
                        <TextField id="url" label="Build URL" name="repo_url" defaultValue={build.repo_url} inputRef={repo_url_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="branch" label="Build Branch" name="repo_branch" defaultValue={build.repo_branch} inputRef={repo_branch_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="deployment_path" label="Build Branch" name="deployment_path" defaultValue={build.deployment_path} inputRef={deployment_path_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormGroup fullWidth sx={{ m: 1 }}>
                        <FormControlLabel
                            control={<Checkbox id="has_submodules" label="Has Submodules" name="has_submodules" checked={build.has_submodules} inputRef={has_submodules_ref} />}
                            label="Has Submodules" />
                    </FormGroup>
                </div>
                <div className="flex flex-row my-5">
                    <Button variant="contained" onClick={() => update()}>Update</Button>
                </div>
            </form>

        </div>
    );

}
