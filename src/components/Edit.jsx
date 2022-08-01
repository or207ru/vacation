///////////////////////////////////////////
//
// component for edditing specific vacation
// permited only to the admin
//
///////////////////////////////////////////

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import MessageIcon from '@mui/icons-material/Message';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

// initializing the classes for styling
const PREFIX = 'Admin';
const classes = {
    paper: `${PREFIX}-paper`,
    avatar: `${PREFIX}-avatar`,
    formRow: `${PREFIX}-form`,
    err: `${PREFIX}-err`,
};

// defenition of style
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.paper}`]: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        marginTop: theme.spacing(8),
        borderRadius: 4,
    },
    [`& .${classes.err}`]: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
    [`& .${classes.formRow}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    [`& .${classes.avatar}`]: {
        marginRight: '6px',
    },
}));


const Edit = () => {

    // usses for navigation and sending data to other routes
    let navigate = useNavigate();
    const location = useLocation();

    // retrieving data from redux
    const user = useSelector(state => state.user);

    // seting tHE initial values for the component
    const [image, setImage] = useState(location.state.img);
    const [price, setPrice] = useState(location.state.price);
    const [description, setDescription] = useState(location.state.description);
    const [startAt, setStartAt] = useState(location.state.start);
    const [endAt, setEndAt] = useState(location.state.end);
    const [errMsg, setErrMgs] = useState("");

    // sending the editet data to the server
    const editVac = async () => {
        if (!localStorage.token || !user.password) return navigate('/', { replace: false });
        try {
            await fetch('http://localhost:1000/api/vacations/update', {
                method: "put",
                headers: {
                    "Content-type": "application/json",
                    'token': localStorage.token
                },
                body: JSON.stringify({
                    id: location.state.id,
                    img: image,
                    price,
                    first_day: startAt,
                    last_day: endAt,
                    description
                })
            });
            setErrMgs("*** DONE ***");
            setTimeout(() => {
                setErrMgs("");
            }, 2000);
            clearField();
            navigate('/admin', { replace: false });
        } catch (err) {
            setErrMgs("sorry, server issu");
            setTimeout(() => {
                setErrMgs("");
            }, 2000);
        }
    };

    // clearing the form fields
    const clearField = async () => {
        document.getElementById("vacation-form-edit").reset();
        setImage("");
        setPrice("");
        setDescription("");
        setStartAt("");
        setEndAt("");
        navigate('./admin', { replace: false });
    };

    // display - showing the previos data on the form field and allowed to edit it
    return (
        <Root>
            <main>
                {errMsg ? (<Paper elevation={8} className={classes.err}>{errMsg}</Paper>) : ("")}
                <Container component="main" maxWidth="xs">
                    <Paper elevation={6}>
                        <div className={classes.paper}>
                            <form id="vacation-form-edit" className={classes.form} autoComplete="off">
                                <span className={classes.formRow}>
                                    <Avatar className={classes.avatar}>
                                        <ImageIcon />
                                    </Avatar>
                                    <TextField
                                        value={image}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="image"
                                        label="image"
                                        name="image"
                                        autoFocus
                                        onChange={e => setImage(e.target.value)}
                                    />
                                </span>
                                <span className={classes.formRow}>
                                    <Avatar className={classes.avatar}>
                                        <AttachMoneyIcon />
                                    </Avatar>
                                    <TextField
                                        value={price}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="price"
                                        label="price"
                                        name="price"
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                </span>
                                <span className={classes.formRow}>
                                    <Avatar className={classes.avatar}>
                                        <MessageIcon />
                                    </Avatar>
                                    <TextField
                                        value={description}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="description"
                                        label="description"
                                        name="description"
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </span>
                                <span className={classes.formRow}>
                                    <Avatar className={classes.avatar}>
                                        <DateRangeIcon />
                                    </Avatar>
                                    <TextField
                                        value={startAt}
                                        variant="outlined"
                                        margin="normal"
                                        id="start"
                                        label="start at"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={e => setStartAt(e.target.value)}
                                    />
                                    <TextField
                                        value={endAt}
                                        variant="outlined"
                                        margin="normal"
                                        id="end"
                                        label="end at"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={e => setEndAt(e.target.value)}
                                    />
                                </span>
                                <span className={classes.formRow}>
                                    <Fab onClick={editVac} color="primary" aria-label="add">
                                        <AddIcon />
                                    </Fab>
                                    <Fab onClick={clearField} color="secondary" aria-label="edit">
                                        <ClearIcon />
                                    </Fab>
                                </span>
                            </form>
                        </div>
                    </Paper>
                </Container>
            </main>
        </Root>
    );
};

export default Edit;