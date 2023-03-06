import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from "./components/Dialog.js";
import ChildModal from "./components/Modal.js";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Editor from "@monaco-editor/react";
import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { getData, appendConsoleContent, variousAjax } from './store/slices/VhostSlice.js';
import axios from 'axios';
export default function VhostList() {
    let vhostNames = [];
    const [showAlert, setShowAlert] = React.useState(false);
    let definitions = [];
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const vhosts = useSelector((state) => state.Vhost.vhosts);
    const enabled = useSelector((state) => state.Vhost.enabled);
    vhosts.map((vhost) => {
        Object.keys(vhost).map((key) => {
            let name = key;
            let def = vhost[key];
            vhostNames.push(name);
            definitions[name] = def;
        });
    })

    function handleEditorDidMount(editor) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        editorRef.current = editor;
    }

    const toggleVhost = (vhost, type) => {
        axios.post("/vhosts/startStopVhost", { name: vhost, type: type })
            .then((res) => {
                dispatch(appendConsoleContent(res.data));
                dispatch(getData());
            });
    };
    const deleteVhost = (vhost) => {
        dispatch(variousAjax({ type: "deleteVhost", name: vhost }));
    }
    const runCertbot = (vhost) => {
        dispatch(variousAjax({ type: "runCertbot", name: vhost }));
    }
    const saveValue = (vhost) => {
        let value = editorRef.current.getValue();
        axios.post("/vhosts/updatevhost", { name: vhost, value: value }).then((res) => {
            dispatch(appendConsoleContent(res.data));
            dispatch(getData());
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);

            }, 2000);
        });
    }



    return (
        vhostNames.map((vhost) => {
            let activeClasses = "rounded-lg  outline outline-offset-1 mt-2 mx-3  px-3 w-24 text-center my-auto text-xl height-100 ";
            if (!enabled.includes(vhost)) {
                activeClasses += "outline-red-800";
            } else {
                activeClasses += "outline-teal-600";
            }
            return (
                <div class="flex flex-row my-4 pb-4 border-b-2 border-grey-500">
                    <div class={activeClasses}>
                        {enabled.includes(vhost) ? "Active" : "Inactive"}
                    </div>
                    <div>
                        <h2 class="text-gray-700">
                            {vhost}
                        </h2>
                        <div class="flex flex-row">
                            <ChildModal buttonText="Edit" title="Editor"
                                variant="contained"
                                color="tertiary"
                                width="1000px"
                                confirmButton={
                                    <Button variant="contained" color="primary" onClick={() => saveValue(vhost)} sx={{ marginLeft: "10px" }}> Save </Button>
                                }
                                content={
                                    <>
                                        <div class="flex flex-row">
                                            <div class="flex flex-col">
                                                <h2 class="text-gray-700">
                                                    {vhost}
                                                </h2>
                                                <div class="flex flex-row">
                                                    <div class="flex flex-col">
                                                        <Editor
                                                            height="700px"
                                                            width="800px"
                                                            theme="vs-dark"
                                                            default-language="freemarker2"
                                                            defaultValue={definitions[vhost]}
                                                            onMount={handleEditorDidMount}
                                                        />
                                                        <div
                                                            class="flex flex-row justify-end"
                                                        >
                                                            {showAlert &&
                                                                <Alert severity="success">Save done!</Alert>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                sx={{ marginRight: "10px" }}
                            />
                            {!enabled.includes(vhost) ?
                                <>
                                    <Button variant="contained" color="primary" onClick={() => toggleVhost(vhost, true)}>
                                        Enable
                                    </Button>
                                    <ConfirmDialog
                                        startIcon={<DeleteForeverIcon />}
                                        color="error"
                                        sx={{ marginLeft: "10px" }}
                                        buttonText="Delete"
                                        title="Delete Vhost"
                                        variant="contained"
                                        content="Are you sure you want to delete this vhost?"
                                        confirm={() => deleteVhost(vhost)} />
                                </>
                                :
                                <>
                                    <Button variant="contained" color="secondary" onClick={() => toggleVhost(vhost, false)}>
                                        Disable
                                    </Button>
                                    {!vhost.includes("ssl") ? (
                                        <ConfirmDialog
                                            variant="outlined"
                                            color="tertiary"
                                            confirm={() => runCertbot(vhost)}
                                            sx={{ marginLeft: "10px" }}
                                            startIcon={<SmartToyIcon />}
                                            buttonText="Run Certbot"
                                            title="Run Certbot"
                                            content="Are you sure you want to run certbot for this vhost? This will create a new ssl cert with certbot - be sure what you do."

                                        />

                                    ) : null}
                                </>
                            }
                        </div>
                    </div>

                    <span class="" />
                </div>
            )
        })
    )

}
