const router = require("express").Router();
const { myQuery } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// handling new registration. restricting duplicate username * for users
router.post('/register', async (req, res) => {
    try {
        // reciving info from the body
        const { name, username, password, admin_pass } = req.body;
        if (!name || !username || !password)
            return res.status(400).json({ err: true, msg: 'missing some info' });

        // check if username in use (assume that username cant be empty)
        const users = await myQuery(`SELECT username FROM users WHERE username = "${username}"`);
        if (users.length)
            return res.status(409).json({ err: true, msg: 'username is allready taken, next time be faster' });

        // create hash password
        const hash = await bcrypt.hash(password, 10);

        // create the query and add some extras for admin case
        const is_admin = admin_pass == process.env.ADMIN_PASS;
        let qry = `INSERT INTO users (name, username, password ${is_admin ? ", role" : ""})
        VALUES ("${name}", "${username}", "${hash}" ${is_admin ? ", 'admin'" : ""})`;

        // execute the query
        await myQuery(qry);
        res.status(201).json({ err: false, msg: "user added successfuly" });

    } catch (err) {
        res.status(500).json({ err: true, msg: err });
    }
});


// handeling login and provide token to passed login * for users and admin
router.post('/login', async (req, res) => {
    try {
        // recive info from the body
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ err: true, msg: 'missing some info' });
        // cheking authentication
        const qry = `SELECT * FROM users WHERE username = "${username}"`;
        const user = await myQuery(qry);
        if (user.length) {
            const didPass = await bcrypt.compare(password, user[0].password);
            if (didPass) {
                const token = jwt.sign(
                    // create token for 10 houers validity
                    { ...user[0], exp: Math.floor(Date.now() / 1000) + 60*60*10 }, process.env.TOKEN_SECRET);
                return res.json({ err: false, token });
            }
        } // kicking out the rude user who gave us wrong info
        return res.status(401).json({ err: true, msg: "some bad info" });

    } catch (err) {
        res.status(500).json(({ err: true, msg: err }));
    }
});

module.exports = router;
