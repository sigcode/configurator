import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { AddTask } from '@mui/icons-material';
import Edit from './Edit';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Moment from 'moment';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import ConfirmDialog from '../vhosts/components/Dialog';
export default function Users(props) {
    const [users, setUsers] = useState(props.users);
    const [showTable, setShowTable] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const handleChangePage = (event, newPage) => {
        event;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteUser = (id) => {
        axios.post('/users/destroy', { id: id }).then((response) => {
            if (response.status === 200) {
                let users = response.data;
                setUsers(users);
            }
        });
    }
    const editUser = (id) => {
        setShowTable(false);
        setCurrentUserId(id);
    }

    const newUser = () => {
        setShowTable(false);
        setCurrentUserId(null);
    }


    useEffect(() => {
        axios.post('/users/all').then((response) => {
            if (response.status === 200) {
                let users = response.data;
                setUsers(users);
            }
        });
    }, [showTable]);


    return (

        <div>
            {showTable ? (
                <>
                    <div class="flex flex-row justify-between my-2">
                        <h1>User</h1>
                        <Button variant="contained" color="tertiary" onClick={() => newUser()}><AddTask className="mr-2" /> New User</Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="right">Name</StyledTableCell>
                                    <StyledTableCell align="right">Email</StyledTableCell>
                                    <StyledTableCell align="right">Created</StyledTableCell>
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user, index) => {
                                        return (
                                            <TableRow
                                                key={user.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="right">{user.name}</TableCell>
                                                <TableCell align="right">{user.email}</TableCell>
                                                <TableCell align="right">{Moment(user.created_at).format('DD.MM.YYYY')}</TableCell>
                                                <TableCell align="right" >
                                                    <div class="flex flex-row justify-center">
                                                        <Button variant='contained' size="small" onClick={() => editUser(user.id)}>Edit</Button>
                                                        <ConfirmDialog
                                                            sx={{ ml: 1 }}
                                                            variant='contained'
                                                            size="small"
                                                            buttonText="Delete"
                                                            color="error"
                                                            content="Delete User?"
                                                            confirm={() => deleteUser(user.id)}>Delete</ConfirmDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                margin: '0',
                                justifyContent: 'center',
                            },
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <Edit back={() => setShowTable(true)} userId={currentUserId} users={users} />
            )}
        </div>
    );
}
