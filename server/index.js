// importing and initialization
const express = require("express");
const dotenv = require("dotenv");
require("./db");
dotenv.config();
const app = express();
app.use(require('cors')());

// getting the port from the process in case of unlocal hosting
const port = process.env.PORT || 1000;

// seeting the routs
app.use(express.json());
app.use('/api/users', require("./routs/users"));
app.use('/api/vacations', require("./routs/vacations"));

// raising the server
app.listen(process.env.PORT || port, () => {
    console.log(`hii from port ${port}`);
});

