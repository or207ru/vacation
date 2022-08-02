///////////////////////////////////////////
//
// Holding the admin screenss and utilities
//
///////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart, BarController, BarElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
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
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import ImageIcon from '@mui/icons-material/Image';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

// inner screen
const SHOW_ALL = 0;
const ADD_NEW = 1;
const REPORT = 2;
let myChart;

// classes for styling
const PREFIX = 'Admin';
const classes = {
    toolbar: `${PREFIX}-toolbar`,
    title: `${PREFIX}-title`,
    vacationContent: `${PREFIX}-vacationContent`,
    cardGrid: `${PREFIX}-cardGrid`,
    card: `${PREFIX}-card`,
    followed: `${PREFIX}-followed`,
    cardContent: `${PREFIX}-cardContent`,
    cardMedia: `${PREFIX}-cardMedia`,
    middleline: `${PREFIX}-middleline`,
    underline: `${PREFIX}-underline`,
    badge: `${PREFIX}-badge`,
    action: `${PREFIX}-action`,
    footer: `${PREFIX}-footer`,
    err: `${PREFIX}-err`,
    avatar: `${PREFIX}-avatar`,
    formRow: `${PREFIX}-formRow`,
    form: `${PREFIX}-form`,
    wrap: `${PREFIX}-wrap`,
    clickAble: `${PREFIX}-clickAble`,
};

// defining the style
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.toolbar}`]: {
        borderBottom: "3px solid red",
    },
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
        // display: 'flex',
        // justifyContent: 'space-evenly'
    },
    [`& .${classes.underline}`]: {
        display: 'flex',
        justifyContent: 'space-around'
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
        fontWeight: 'bold',
    },
    [`& .${classes.wrap}`]: {
        margin: '6vh 0 1vh 0',
        padding: '12px',
    },
    [`& .${classes.form}`]: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    [`& .${classes.formRow}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    [`& .${classes.avatar}`]: {
        marginRight: '6px',
    },
    [`& .${classes.err}`]: {
        textAlign: 'center',
        backgroundColor: "rgba(220,0,50,0.5)",
        marginTop: theme.spacing(3),
        fontWeight: "bold",
    },
    [`& .${classes.clickAble}`]: {
        cursor: 'pointer',
        margin: '0 10px 1px 0px',
        '&:hover': {
            border: 'solid 0.5px',
            borderRadius: '15%',
            marginBottom: '0px',
        },
    },
}));

// main function for admin control
const Admin = () => {

    // usses for navigation and sending data to other routes
    let navigate = useNavigate();
    const dispatch = useDispatch();

    // retrieving data from redux
    const user = useSelector(state => state.user);
    const vacations = useSelector(state => state.vacations);

    // seting tHE initial values for the component
    const [actionFollow, setActionFollow] = useState("");
    const [screen, setScreen] = useState(0);
    const [errMsg, setErrMgs] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [chartOn, setChartOn] = useState(true);

    // swiching by frames and turning on the chart copntent
    const handleNavChange = (e, newScreen) => {
        setChartOn(newScreen === REPORT);
        setScreen(newScreen);
    };

    // fetching the vacations from the server
    const getVacations = async () => {
        if (!localStorage.token || !user.password) return navigate('/', { replace: false });
        try {
            const res = await fetch('http://localhost:1000/api/vacations', {
                method: "get",
                headers: { 'token': localStorage.token }
            });
            dispatch({
                type: "GETIN",
                payload: await res.json()
            });
        } catch (err) {
            console.log(err);
        }
    };

    // invoking the vacations fetching in case of changes in vacation content or refetching
    useEffect(() => {
        getVacations();
    }, [actionFollow, errMsg]);

    // removing the token and navigate out of admin page
    const logout = () => {
        localStorage.clear();
        dispatch({
            type: "LOGOUT"
        });
        navigate('/', { replace: false });
    };

    // sending request for deleting vacation
    const handleDelete = async (id) => {
        setActionFollow(`Vacation ${id} deleted`);
        try {
            const res = await fetch('http://localhost:1000/api/vacations/update', {
                method: 'delete',
                headers: {
                    "Content-type": "application/json",
                    'token': localStorage.token
                },
                body: JSON.stringify({ id })
            });
            setTimeout(() => {
                setActionFollow("");
            }, 2750);
        }
        catch (err) {
            console.log(err);
        }
    };

    // sending request for adding vacation
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
                });
                setErrMgs("*** DONE ***");
                setTimeout(() => {
                    setErrMgs("");
                }, 2000);
                clearField();
            } catch (err) {
                setErrMgs("sorry, server issu");
                setTimeout(() => {
                    setErrMgs("");
                }, 2000);
            }
        } else {
            setErrMgs("You must fill all fields");
            setTimeout(() => {
                setErrMgs("");
            }, 2200);
        }
    };

    // clearing the form fields
    const clearField = async () => {
        document.getElementById("vacation-form").reset();
        setImage("");
        setPrice("");
        setDescription("");
        setStartAt("");
        setEndAt("");
    };

    // returning the main screen for showing the vacations
    const showAll = () => {
        return (
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
                                    <span className={classes.middleline}>
                                        <br />
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
                                        <EditOutlinedIcon className={classes.clickAble} onClick={() => navigate(
                                            '/edit',
                                            {
                                                state: {
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
        );
    };

    // returning the screen adding new vacations
    const addNew = () => {
        return (
            <span>
                {errMsg ? (<Paper elevation={8} className={classes.err}>{errMsg}</Paper>) : ("")}
                <Container component="main" maxWidth="xs">
                    <Paper elevation={6} className={classes.wrap}>
                        <div className={classes.paper}>
                            <form id="vacation-form" className={classes.form} autoComplete="off">
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
        );
    };

    // prepering the chart of followed vacations
    const report = () => {

        // cleaning the canvas for redrawing it
        if (myChart !== undefined) {
            myChart.destroy();
        }

        // setting the chart data
        let ctx = document.getElementById('myChart').getContext('2d');
        Chart.register(BarController, BarElement, PointElement, LinearScale, Title, CategoryScale);
        const vac_id = [];
        const vac_followers = [];
        for (const v of Object(vacations)) {
            if (v.followed) {
                vac_id.push(v.id);
                vac_followers.push(v.followed);
            }
        }

        // shaping the chart on the canvas
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vac_id,
                datasets: [{
                    data: vac_followers,
                    label: "Total",
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "vacation id"
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "followers"
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    };

    // setting the data of the screen in case of swiching
    useEffect(() => {
        switchFrame(screen);
    }, [screen]);

    // returning the screen to be showed
    const switchFrame = (frame) => {
        switch (frame) {
            case SHOW_ALL: return showAll();
            case ADD_NEW: return addNew();
            case REPORT: return report();
        }
    };

    // אhe raw page that stores the navigation and subpages
    return (
        <Root>
            <AppBar position="fixed">
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h5" className={classes.title}>Ohhhh mighty <b>{user.name}</b></Typography>
                    {actionFollow.length ? (<Paper elevation={8} className={classes.action}>{actionFollow}</Paper>) : ("")}
                    <Button color="secondary" variant="outlined" onClick={logout}><b>LOGOUT</b></Button>
                </Toolbar>
            </AppBar>

            {/* navigation and presenting the current route */}
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
        </Root>
    );
};

export default Admin;
