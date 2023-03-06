import { Chip } from "@mui/material";
import React from "react";
export default function Status(props) {
    const status = props.status;

    const color = status === 'success' ? 'green' : status === 'failed' ? 'red' : 'yellow';
    const colorText = status === 'success' ? 'white' : status === 'failed' ? 'white' : 'black';
    let text = "";
    switch (status) {
        case 'success':
            text = "Success";
            break;
        case 'failed':
            text = "Failed";
            break;
        case 'running':
            text = "Running";
            break;
        case 'pending':
            text = "Pending";
            break;
        case 'queued':
            text = "Queued";
            break;
        case 'canceled':
            text = "Canceled";
            break;
        default:
            text = "Unknown";
            break;

    }
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Chip label={text} style={{ backgroundColor: color, color: colorText }} />
        </div>
    );


}
