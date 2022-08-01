/////////////////////////////////////////////////
//
// Managing the vacation displaying and following
//
/////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';

// classes for styling
const PREFIX = 'Vacations';
const classes = {
    title: `${PREFIX}-title`,
    vacationContent: `${PREFIX}-vacationContent`,
    cardGrid: `${PREFIX}-cardGrid`,
    card: `${PREFIX}-card`,
    followed: `${PREFIX}-followed`,
    cardMedia: `${PREFIX}-cardMedia`,
    cardContent: `${PREFIX}-cardContent`,
    footer: `${PREFIX}-footer`,
    middleline: `${PREFIX}-middleline`,
    underline: `${PREFIX}-underline`,
    badge: `${PREFIX}-badge`,
    action: `${PREFIX}-action`,
};

// defining the style
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.title}`]: {
        flexGrow: 1,
    },
    [`& .${classes.vacationContent}`]: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(15, 0, 2),
    },
    [`& .${classes.cardGrid}`]: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    [`& .${classes.card}`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    [`& .${classes.followed}`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: "0.2px rgb(184,134,11) solid",
        backgroundColor: "rgba(255,215,0,0.05)",
    },
    [`& .${classes.cardMedia}`]: {
        height: 0,
        paddingTop: '56.25%',
    },
    [`& .${classes.cardContent}`]: {
        flexGrow: 1,
        alignSelf: 'center',
    },
    [`& .${classes.footer}`]: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    [`& .${classes.middleline}`]: {
        margin: theme.spacing(2, 0),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    [`& .${classes.underline}`]: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    [`& .${classes.badge}`]: {
        margin: theme.spacing(0, 1),
    },
    [`& .${classes.action}`]: {
        position: 'absolute',
        textAlign: 'center',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(220,220,255,0.8)',
        border: 'solid blue 0.3px',
        padding: '4px',
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
}));

const Vacations = () => {

    // usses for navigation and sending data to other routes
    let navigate = useNavigate();
    const dispatch = useDispatch();

    // setting redux dispatching
    const user = useSelector(state => state.user);
    const vacations = useSelector(state => state.vacations);

    // seting the initial values for the component
    const [actionFollow, setActionFollow] = useState("");

    // requesting the vacations from the server
    const getVacations = async () => {
        if (!localStorage.token || !user.password) return navigate('/', { replace: false });
        const res = await fetch('http://localhost:1000/api/vacations', {
            method: "get",
            headers: { 'token': localStorage.token }
        });
        dispatch({
            type: "GETIN",
            payload: await res.json()
        });
    };

    // invoking vacation request from the server in case of change in some vacation
    useEffect(() => {
        getVacations();
    }, [actionFollow]);

    // logout by removing the token and redirecting to the login page
    const logout = () => {
        localStorage.clear();
        dispatch({
            type: "LOGOUT"
        });
        navigate('/', { replace: false });
    };

    // sending request to the server to update follo/unfollow for specific vacation
    const handleFollow = async (id, turnOff) => {
        try {
            const res = await fetch('http://localhost:1000/api/vacations/follow', {
                method: turnOff ? 'delete' : 'post',
                headers: {
                    "Content-type": "application/json",
                    'token': localStorage.token
                },
                body: JSON.stringify({ vacation_id: id })
            });
            const vn = `vacation number ${id}`;
            setActionFollow(turnOff ? `Unfollowed ${vn}` : `Followed ${vn}`);
            setTimeout(() => {
                setActionFollow("");
            }, 2750);
        }
        catch (err) {
            setActionFollow("sorry there is no server");
        }
    };

    // displaying all of the vacation
    // main sorting by the one which followed by the user
    // and secondary sorting according to the number of followers
    return (
        <Root>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h5" className={classes.title}>Wellcom {user.name}</Typography>
                    {actionFollow.length ? (<Paper elevation={8} className={classes.action}>{actionFollow}</Paper>) : ("")}
                    <Button color="secondary" variant="outlined" onClick={logout}><b>LOGOUT</b></Button>
                </Toolbar>
            </AppBar>

            <main>
                <div className={classes.vacationContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Vacations...
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Enjoy our deals and spand as much as you can
                        </Typography>
                    </Container>
                </div>

                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {vacations.map((card) => (
                            <Grid item key={card.id} xs={12} sm={6} md={4}>
                                <Card className={`${classes.card} ${card.do_i_follow ? classes.followed : classes.card}`}>
                                    <CardMedia className={classes.cardMedia}
                                        image={card.img}
                                        title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            price: {card.price}$
                                        </Typography>
                                        <Typography>
                                            {card.description}
                                        </Typography>
                                        <br />
                                        <span className={classes.middleline}>
                                            <Typography>
                                                from: {card.first_day}
                                            </Typography>
                                            <Typography>
                                                to: {card.last_day}
                                            </Typography>
                                        </span>
                                    </CardContent>
                                    <CardActions className={classes.underline}>
                                        <Button onClick={() => handleFollow(card.id, card.do_i_follow)} size="small" color={card.do_i_follow ? "secondary" : "primary"}>
                                            {card.do_i_follow ? "Cancel follow" : "I want to Follow"}
                                        </Button>
                                        < Badge badgeContent={card.followed} className={classes.badge} color="primary">
                                            <Typography>followers</Typography>
                                        </Badge>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>

            <footer className={classes.footer}>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Hope you enjoied!
                </Typography>
            </footer>
        </Root>
    );
};

export default Vacations;