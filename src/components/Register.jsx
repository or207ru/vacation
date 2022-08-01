/////////////////////////////////////////////////////////////
//
// Managing the registration mechanizem
// redirecting to 'login' in case of succssesfull regitration
//
/////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// classes for styling
const PREFIX = 'Register';
const classes = {
    headline: `${PREFIX}-headline`,
    paper: `${PREFIX}-paper`,
    avatar: `${PREFIX}-avatar`,
    form: `${PREFIX}-form`,
    submit: `${PREFIX}-submit`,
    err: `${PREFIX}-err`,
};

// defining the style
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.headline}`]: {
        margin: 'auto',
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '15vh',
    },
    [`& .${classes.paper}`]: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    [`& .${classes.avatar}`]: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    [`& .${classes.form}`]: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    [`& .${classes.submit}`]: {
        margin: theme.spacing(2, 0, 2),
    },
    [`& .${classes.err}`]: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
}));

const Register = () => {

    // usses for navigation and sending data to other routes
    let navigate = useNavigate();

    // seting tHE initial values for the component
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMgs] = useState("");

    // sending the registration field to the server - setting new user if the detail are valid
    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/users/register', {
                method: 'post',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ name, username, password })
            });
            const data = await res.json();
            if (data.err) {
                setErrMgs(data.msg);
                setTimeout(() => {
                    setErrMgs("");
                }, 1500);
            } else {
                navigate('/login', { replace: false });
            }

        } catch (err) {
            setErrMgs("sorry, server issu");
            setTimeout(() => {
                setErrMgs("");
            }, 1500);
        }
    };

    // displaying the field of registration
    return (
        <Root>
            <Paper className={classes.headline} elevation={3}>
                <Typography variant="h4">
                    Wellcome to Rubin-Tours
                </Typography>
            </Paper>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography variant="h5">Register</Typography>
                    <form className={classes.form} autoComplete="off">
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="name"
                            label="name"
                            id="name"
                            autoFocus
                            onChange={e => setName(e.target.value)}
                        /><TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="user name"
                            name="username"
                            onChange={e => setUsername(e.target.value)}
                        /><TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
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
                        >Sign Me in</Button>
                        <Link to="/login">
                            Allready have an account? go to Login</Link>
                        <Paper elevation={8} className={classes.err}>{errMsg}</Paper>
                    </form>
                </div>
            </Container>
        </Root>
    );
};

export default Register;