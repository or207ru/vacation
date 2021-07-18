import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    vacationContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(15, 0, 2),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    followed: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: "0.2px rgb(184,134,11) solid",
        backgroundColor: "rgba(255,215,0,0.05)",
    },
    cardMedia: {
        height: 0,
        paddingTop: '56.25%',
    },
    cardContent: {
        flexGrow: 1,
        alignSelf: 'center',
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    middleline: {
        margin: theme.spacing(2, 0),
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    underline: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    badge: {
        margin: theme.spacing(0, 1),
    },
    action: {
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


const Vacations = ({ history }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const vacations = useSelector(state => state.vacations)
    const [actionFollow, setActionFollow] = useState("")


    const getVacations = async () => {
        if (!localStorage.token || !user.password) return history.push('/')
        const res = await fetch('http://localhost:1000/api/vacations', {
            method: "get",
            headers: { 'token': localStorage.token }
        })
        dispatch({
            type: "GETIN",
            payload: await res.json()
        })
    }

    useEffect(() => {
        getVacations()
    }, [actionFollow])

    const logout = () => {
        localStorage.clear()
        dispatch({
            type: "LOGOUT"
        })
        history.push('/')
    }

    const handleFollow = async (id, turnOff) => {
        try {
            const res = await fetch('http://localhost:1000/api/vacations/follow', {
                method: turnOff ? 'delete' : 'post',
                headers: {
                    "Content-type": "application/json",
                    'token': localStorage.token
                },
                body: JSON.stringify({ vacation_id: id })
            })
            const vn = `vacation number ${id}`
            setActionFollow(turnOff ? `Unfollowed ${vn}` : `Followed ${vn}`)
            setTimeout(() => {
                setActionFollow("")
            }, 2750);
        }
        catch (err) {
            console.log(err)
            setActionFollow("sorry there is no server")
        }
    }



    return (
        <div>
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
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card className={classes.card, card.do_i_follow ? classes.followed : classes.card}>
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
        </div>
    )
}

export default Vacations;

