import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTests, setCurrentTest, getData } from './store/slices/TestSlice';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Moment from 'moment';
import { Button } from '@mui/material';
import SingleTest from './SingleTest';
import { AddTask } from '@mui/icons-material';
import { Stack } from '@mui/system';
import axios from 'axios';
import TestsAlert from './components/TestsAlert';
export default function Tests(props) {
    const [open, setOpen] = React.useState(false);
    const [testName, setTestName] = useState('');
    const [showTable, setShowTable] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();

    const storeTests = useSelector((state) => state.Test.tests);

    useEffect(() => {
        let tests = props.tests;
        dispatch(setTests(tests));
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));


    const runTest = (id, name) => {
        setTestName(name);
        setOpen(true);
        const data = {
            id: id,
        };
        axios.post('/tests/run', data).then((response) => {

        });
        setTimeout(() => {
            setOpen(false);
            setTestName('');
        }, 3000);
    }

    const handleChangePage = (event, newPage) => {
        event;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const openTest = (test) => {
        dispatch(setCurrentTest(test));
        setShowTable(false);
    };

    const newTest = () => {
        dispatch(setCurrentTest(null));
        setShowTable(false);
    };

    const backToTable = () => {
        dispatch(getData());
        setShowTable(true);
        setCurrentTest(null);
    };
    return (

        <div>
            {showTable ? (
                <>
                    <div class="flex flex-row justify-between my-2">
                        <h1>Tests</h1>
                        <TestsAlert open={open} setOpen={setOpen} testName={testName} />
                        <Button variant="contained" color="tertiary" onClick={() => newTest()}><AddTask className="mr-2" /> New Test</Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Repo Name</StyledTableCell>
                                    <StyledTableCell align="right">Repo URL</StyledTableCell>
                                    <StyledTableCell align="right">Repo Branch</StyledTableCell>
                                    <StyledTableCell align="right">Deployment Path</StyledTableCell>
                                    <StyledTableCell align="right">Test Type</StyledTableCell>
                                    <StyledTableCell align="right">Updated At</StyledTableCell>
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storeTests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((test, index) => {
                                        return (
                                            <TableRow
                                                key={test.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {test.repo_name}
                                                </TableCell>
                                                <TableCell align="right">{test.repo_url}</TableCell>
                                                <TableCell align="right">{test.repo_branch}</TableCell>
                                                <TableCell align="right">{test.deployment_path}</TableCell>
                                                <TableCell align="right">{test.test_type}</TableCell>
                                                <TableCell align="right">{Moment(test.updated_at).format('DD.MM.YYYY hh:mm:ss')}</TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="column" spacing={1}>
                                                        <Button variant='contained' size="small"
                                                            onClick={() => openTest(test.id)}>Edit</Button>
                                                        <Button variant='contained' size="small" color="secondary"
                                                            onClick={() => runTest(test.id, test.repo_name)}>Run</Button>

                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
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
                            count={storeTests.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </>
            ) : (
                <SingleTest back={() => backToTable()} />
            )}
        </div>


    );




}


