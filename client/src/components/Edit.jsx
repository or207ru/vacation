import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from "react-router-dom";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MessageIcon from '@material-ui/icons/Message';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        marginTop: theme.spacing(8),
        borderRadius: 4,
    },
    err: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
    formRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    avatar: {
        marginRight: '6px',
    },
}));

const Edit = ({ history }) => {

    const location = useLocation();
    const classes = useStyles();
    const user = useSelector(state => state.user)

    const [image, setImage] = useState(location.state.img)
    const [price, setPrice] = useState(location.state.price)
    const [description, setDescription] = useState(location.state.description)
    const [startAt, setStartAt] = useState(location.state.start)
    const [endAt, setEndAt] = useState(location.state.end)
    const [errMsg, setErrMgs] = useState("")


    const editVac = async () => {
        if (!localStorage.token || !user.password) return history.push('/')
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
            })
            setErrMgs("*** DONE ***")
            setTimeout(() => {
                setErrMgs("")
            }, 2000)
            clearField()
            history.push('./admin')
        } catch (err) {
            setErrMgs("sorry, server issu")
            setTimeout(() => {
                setErrMgs("")
            }, 2000)
        }
    }

    const clearField = async () => {
        document.getElementById("vacation-form-edit").reset()
        setImage("")
        setPrice("")
        setDescription("")
        setStartAt("")
        setEndAt("")
        history.push('./admin')
    }

    return (
        <main>
            {errMsg ? (<Paper elevation={8} className={classes.err}>{errMsg}</Paper>) : ("")}
            <Container component="main" maxWidth="xs">
                <Paper elevation={6}>
                    <div className={classes.paper}>
                        <form id="vacation-form-edit" className={classes.form} autocomplete="off">
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
    );
}

export default Edit;