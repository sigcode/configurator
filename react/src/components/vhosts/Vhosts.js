import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VhostList from './vhlist.js';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { getData, getPHPVersion, apacheCtl, variousAjax, setPHPVersionChanged, setForceReload } from './store/slices/VhostSlice.js';
import FormControlLabel from '@mui/material/FormControlLabel';
import ChildModal from './components/Modal.js';
import { Input, TextField } from '@mui/material';
import { create } from '@mui/material/styles/createTransitions.js';
import { createVoid } from 'typescript';
export default function Vhosts() {
    const dispatch = useDispatch();
    const vhostNameRef = useRef();
    useEffect(() => {
        dispatch(getPHPVersion());
        dispatch(getData());
    }, []);
    const phpversion = useSelector((state) => state.Vhost.phpversion);
    const consoleContent = useSelector((state) => state.Vhost.consoleContent);
    const changedPHPVersion = useSelector((state) => state.Vhost.changedPHPVersion);
    const forceReload = useSelector((state) => state.Vhost.forceReload);
    if (forceReload) {
        dispatch(getData());
        dispatch(setForceReload(false));
    }

    if (changedPHPVersion) {
        setTimeout(() => {
            dispatch(getPHPVersion());
            dispatch(setPHPVersionChanged(false));
        }, 1000);
    }


    const configtest = () => {
        dispatch(apacheCtl({ command: "configtest" }))
    };
    const restartApache = () => {
        dispatch(apacheCtl({ command: "restart" }))
    };

    const changePHPVersion = (version) => {
        dispatch(variousAjax({ type: "changePHPVersion", version: version }))
    };

    const createVhost = () => {
        let vhostName = vhostNameRef.current.value;
        // check if .conf is in the name
        if (!vhostName.includes(".conf")) {
            vhostName = vhostName + ".conf";
        }
        dispatch(variousAjax({ type: "addVhost", name: vhostName }))
    };
    return (
        <div class="grid grid-cols-2 gap-4">
            <div class="left mt-10">
                <h1 class=" text-gray-700">
                    Vhosts Available:
                </h1>
                <hr />
                <ChildModal
                    variant="contained"
                    buttonText="Create Vhost"
                    width="600px"
                    title="Create Vhost"
                    content={
                        <>
                            <div class="flex flex-row">
                                <TextField id="vhostName" label="VHost Name" variant="standard" inputRef={vhostNameRef} />
                            </div>
                            <div class="flex flex-row mt-4">
                                .conf ending is not required - it will be added automatically
                            </div>
                            <div class="flex flex-row mt-4">
                                <Button variant="contained" color="tertiary" onClick={() => createVhost()} >
                                    Create Vhost
                                </Button>
                            </div>
                        </>
                    }
                    sx={{
                        marginBottom: "50px", marginTop: "20px"
                    }}
                />
                <VhostList />
            </div>
            <div class="right">
                <div class="text-lg text-gray-700">
                    <div class="flex flex-row">
                        <Button variant="contained" color="secondary" onClick={() => restartApache()}
                            sx={{ marginRight: "100px" }}>
                            Restart Apache
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => configtest()}>
                            Apache Configtest
                        </Button>
                    </div>
                    <div class="flex flex-row mt-4">
                        <FormControlLabel control={
                            <Switch checked={"7.4" == phpversion} onClick={() => changePHPVersion("74")} />
                        } label="PHP 7.4" className="basis-1/3" />
                        <FormControlLabel control={
                            <Switch checked={"8.0" == phpversion} onClick={() => changePHPVersion("80")} />
                        } label="PHP 8.0" className="basis-1/3" />
                        <FormControlLabel control={
                            <Switch checked={"8.1" == phpversion} onClick={() => changePHPVersion("81")} />
                        } label="PHP 8.1" className="basis-1/3" />
                    </div>
                    <div class="bg-slate-600 text-white p-3 overflow-scroll preWrapped" id="consoleWrapper" >
                        <pre >
                            {consoleContent}
                        </pre>
                    </div>

                </div>
            </div>
        </div>
    );
}
