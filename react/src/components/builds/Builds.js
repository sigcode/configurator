import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBuilds, setCurrentBuild, getData } from './store/slices/BuildSlice';
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
import SingleBuild from './SingleBuild';
import { AddTask } from '@mui/icons-material';
export default function Builds(props) {
    const [showTable, setShowTable] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();

    const storeBuilds = useSelector((state) => state.Build.builds);

    useEffect(() => {
        let builds = props.builds;
        dispatch(setBuilds(builds));
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

    const handleChangePage = (event, newPage) => {
        event;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const openBuild = (build) => {
        dispatch(setCurrentBuild(build));
        setShowTable(false);
    };

    const newBuild = () => {
        dispatch(setCurrentBuild(null));
        setShowTable(false);
    };

    const backToTable = () => {
        dispatch(getData());
        setShowTable(true);
        setCurrentBuild(null);
    };
    return (

        <div>
            {showTable ? (
                <>
                    <div class="flex flex-row justify-between my-2">
                        <h1>Builds</h1>
                        <Button variant="contained" color="tertiary" onClick={() => newBuild()}><AddTask className="mr-2" /> New Build</Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Repo Name</StyledTableCell>
                                    <StyledTableCell align="right">Repo URL</StyledTableCell>
                                    <StyledTableCell align="right">Repo Branch</StyledTableCell>
                                    <StyledTableCell align="right">Deployment Path</StyledTableCell>
                                    <StyledTableCell align="right">Build Type</StyledTableCell>
                                    <StyledTableCell align="right">Updated At</StyledTableCell>
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storeBuilds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((build, index) => {
                                        return (
                                            <TableRow
                                                key={build.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {build.repo_name}
                                                </TableCell>
                                                <TableCell align="right">{build.repo_url}</TableCell>
                                                <TableCell align="right">{build.repo_branch}</TableCell>
                                                <TableCell align="right">{build.deployment_path}</TableCell>
                                                <TableCell align="right">{build.build_type}</TableCell>
                                                <TableCell align="right">{Moment(build.updated_at).format('DD.MM.YYYY hh:mm:ss')}</TableCell>
                                                <TableCell align="right"><Button variant='contained'
                                                    onClick={() => openBuild(build.id)}>Edit</Button>
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
                        count={storeBuilds.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <SingleBuild back={() => backToTable()} />
            )}
        </div>


    );




}


