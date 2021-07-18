import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    headline: {
        margin: 'auto',
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '15vh',
    },
    paper: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
    err: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
}))



const Login = ({ history }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMgs] = useState("")


    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/users/login', {
                method: 'post',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            if (data.err) {
                setErrMgs(data.msg)
                setTimeout(() => {
                    setErrMgs("")
                }, 1500)
            } else {
                localStorage.token = data.token
                const decoded = await jwt_decode(data.token)
                dispatch({
                    type: "LOGIN",
                    payload: decoded
                })
                decoded.role === "user" ? history.push('./vacations') : history.push('./admin')
            }

        } catch (err) {
            setErrMgs("sorry, server issu")
            setTimeout(() => {
                setErrMgs("")
            }, 1500)
        }
    }



    return (
        <div>
            <Paper className={classes.headline} elevation={3}>
                <Typography variant="h4">
                    Wellcome to Rubin-Tours
                </Typography>
            </Paper>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login</Typography>
                    <form className={classes.form} autocomplete="off">
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="user name"
                            name="username"
                            autoFocus
                            onChange={e => setUsername(e.target.value)}
                        /><TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="password"
                            type="password"
                            id="password"
                            onChange={e => setPassword(e.target.value)}
                        /><Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
                        >Login</Button>
                        <Link to="/register">
                            Don't have an account? Register</Link>
                        <Paper elevation={8} className={classes.err}>{errMsg}</Paper>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Login;