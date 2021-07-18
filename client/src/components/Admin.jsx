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
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MessageIcon from '@material-ui/icons/Message';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import { green } from '@material-ui/core/colors';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Chart from 'chart.js';

const SHOW_ALL = 0
const ADD_NEW = 1
const REPORT = 2

const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: "3px solid red",
    },
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
        justifyContent: 'space-around'
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
        fontWeight: 'bold',
    },
    clickAble: {
        cursor: 'pointer',
        margin: '0 10px 1px 0px',
        '&:hover': {
            border: 'solid 0.5px',
            borderRadius: '15%',
            marginBottom: '0px',
        },
    },
    wrap: {
        margin: '6vh 0 1vh 0',
        padding: '12px',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    formRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    avatar: {
        marginRight: '6px',
    },
    err: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
}));


const Admin = ({ history }) => {

    const classes = useStyles();
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const vacations = useSelector(state => state.vacations)
    const [actionFollow, setActionFollow] = useState("")
    const [screen, setScreen] = useState(0)
    const [errMsg, setErrMgs] = useState("")
    const [image, setImage] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [startAt, setStartAt] = useState("")
    const [endAt, setEndAt] = useState("")
    const [chartOn, setChartOn] = useState(true)



    const handleNavChange = (e, newScreen) => {
        setChartOn(newScreen === REPORT)
        setScreen(newScreen);
    }

    const getVacations = async () => {
        if (!localStorage.token || !user.password) return history.push('/')
        try {
            const res = await fetch('http://localhost:1000/api/vacations', {
                method: "get",
                headers: { 'token': localStorage.token }
            })
            dispatch({
                type: "GETIN",
                payload: await res.json()
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getVacations()
    }, [actionFollow, errMsg, chartOn])


    const logout = () => {
        localStorage.clear()
        dispatch({
            type: "LOGOUT"
        })
        history.push('/')
    }

    const handleDelete = async (id) => {
        setActionFollow(`Vacation ${id} deleted`)
        try {
            const res = await fetch('http://localhost:1000/api/vacations/update', {
                method: 'delete',
                headers: {
                    "Content-type": "application/json",
                    'token': localStorage.token
                },
                body: JSON.stringify({ id })
            })
            setTimeout(() => {
                setActionFollow("")
            }, 2750);
        }
        catch (err) {
            console.log(err)
        }
    }

    const addVac = async () => {
        if (image && description && price && startAt && endAt) {
            try {
                const res = await fetch('http://localhost:1000/api/vacations/update', {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                        'token': localStorage.token
                    },
                    body: JSON.stringify({
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
            } catch (err) {
                setErrMgs("sorry, server issu")
                setTimeout(() => {
                    setErrMgs("")
                }, 2000)
            }
        } else {
            setErrMgs("You must fill all fields")
            setTimeout(() => {
                setErrMgs("")
            }, 2200)
        }
    }

    const clearField = async () => {
        document.getElementById("vacation-form").reset()
        setImage("")
        setPrice("")
        setDescription("")
        setStartAt("")
        setEndAt("")
    }

    const showAll = () => {
        return (
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
                                    <span>
                                        <DeleteOutlineIcon className={classes.clickAble} onClick={() => handleDelete(card.id)} color="secondary" fontSize="medium" />
                                        <EditOutlinedIcon className={classes.clickAble} onClick={() => history.push({
                                            pathname: './edit', state: {
                                                id: card.id,
                                                img: card.img,
                                                price: card.price,
                                                description: card.description,
                                                start: card.first_day,
                                                end: card.last_day
                                            }
                                        })} style={{ color: green[500] }} fontSize="medium" />
                                    </span>
                                    < Badge badgeContent={card.followed} className={classes.badge} color="primary">
                                        <Typography>followers</Typography>
                                    </Badge>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        )
    }

    const addNew = () => {
        return (
            <span>
                {errMsg ? (<Paper elevation={8} className={classes.err}>{errMsg}</Paper>) : ("")}
                <Container component="main" maxWidth="xs">
                    <Paper elevation={6} className={classes.wrap}>
                        <div className={classes.paper}>
                            <form id="vacation-form" className={classes.form} autocomplete="off">
                                <span className={classes.formRow}>
                                    <Avatar className={classes.avatar}>
                                        <ImageIcon />
                                    </Avatar>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
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
                                        variant="outlined"
                                        margin="normal"
                                        required
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
                                        variant="outlined"
                                        margin="normal"
                                        required
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
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        id="start"
                                        label="start at"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={e => setStartAt(e.target.value)}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
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
                                    <Fab onClick={addVac} color="primary" aria-label="add">
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
            </span>
        )
    }

    const report = () => {
        let c = document.getElementById("myChart")
        let ctx = c.getContext("2d")
        const vac_id = []
        const vac_followers = []
        for (const v of Object(vacations)) {
            if (v.followed) {
                vac_id.push(v.id)
                vac_followers.push(v.followed)
            }
        }
        console.log(vac_id)
        console.log(vac_followers)
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vac_id,
                datasets: [{
                    label: 'for followers',
                    data: vac_followers,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    const switchFrame = (frame) => {
        switch (frame) {
            case SHOW_ALL: return showAll()
            case ADD_NEW: return addNew()
            case REPORT: return report()
        }
    }


    return (
        <div>
            <AppBar position="fixed">
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h5" className={classes.title}>Ohhhh mighty <b>{user.name}</b></Typography>
                    {actionFollow.length ? (<Paper elevation={8} className={classes.action}>{actionFollow}</Paper>) : ("")}
                    <Button color="secondary" variant="outlined" onClick={logout}><b>LOGOUT</b></Button>
                </Toolbar>
            </AppBar>

            <main>
                <div className={classes.vacationContent}>
                    <Container maxWidth="sm">
                        <Paper square>
                            <Tabs
                                value={screen}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={handleNavChange}
                            >
                                <Tab label="Show all" />
                                <Tab label="Add new" />
                                <Tab label="Report" />
                            </Tabs>
                        </Paper>
                    </Container>
                </div>

                {switchFrame(screen)}
                <Container maxWidth="sm">
                    <canvas style={{ display: `${chartOn ? "block" : "none"}` }} id="myChart" width="400" height="300"></canvas>
                </Container>
            </main>

            <footer className={classes.footer}>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    You are the best admin!
                </Typography>
            </footer>
        </div>
    )
}

export default Admin;

