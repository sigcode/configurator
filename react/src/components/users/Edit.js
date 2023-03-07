import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
export default function Edit(props) {
    const userId = props.userId;
    let user = {};
    if (userId === 0) {
        user = {
            id: null,
            name: '',
            email: '',
            password: '',
        };
    } else {
        user = props.users.find((user) => user.id === userId);
    }

    const user_ref = useRef();
    const email_ref = useRef();
    const password_ref = useRef();
    const save = () => {
        const data = {
            id: user.id,
            name: user_ref.current.value,
            email: email_ref.current.value,
            password: password_ref.current.value,
        };
        axios.post('/users/update', data).then((response) => {
            if (response.status === 200) {
                props.back();
            }
            else {
                alert('Something went wrong');
            }
        });
    }


    return (
        <div>
            <Button variant="outlined" onClick={() => props.back()}>Back to Table</Button>
            <h1>Edit User: {user.name}</h1>
            <form action="/builds" method="POST">
                <input type="hidden" name="id" value={user.id} />
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="name" label="User Name" name="name" defaultValue={user.name} inputRef={user_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField id="email" label="Email" name="email" defaultValue={user.email} inputRef={email_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <TextField type="password" id="password" label="Password" name="password" defaultValue={user.password} inputRef={password_ref} />
                    </FormControl>
                </div>
                <div className="flex flex-row my-5">
                    <Button variant="contained" color="primary" onClick={() => save()}>Save</Button>
                </div>
            </form>
        </div>
    );

}
