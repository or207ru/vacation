const router = require("express").Router()
const { myQuery, dateFormation } = require('../db')
const { vtUser, followers, permission, updateFormat } = require("../middleware")

// gets all of the vacations, displayed for users and admin respectivly
router.get('/', [vtUser, followers], async (req, res) => {
    let qry =
        `SELECT *
    FROM follow RIGHT JOIN vacations ON vacations.id = follow.vacation_id
    AND user_id="${req.user.id}" ORDER BY follow.user_id DESC;`
    try {
        const query = await myQuery(qry)
        let vacations = []
        // organize the data for easier useage
        query.forEach(item => {
            const { id, img, price, first_day, last_day, description } = item
            vacations.push({
                id, img, price, first_day: dateFormation(first_day),
                last_day: dateFormation(last_day), description,
                followed: req.followers[item.id] ? req.followers[item.id] : 0,
                do_i_follow: item.user_id != null
            })
        })
        res.status(202).json(vacations)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})


// adding followed vacation for specific user
router.post('/follow', [vtUser, permission("user")], async (req, res) => {
    // check if this row allready exist in the db
    const allready_followed = await myQuery(`SELECT * FROM follow WHERE
    user_id=${req.user.id} and vacation_id=${req.body.vacation_id};`)
    if (allready_followed.length)
        return res.status(202).json({ err: true, msg: `this following is allready exist` })
    const qry = `INSERT INTO follow (user_id, vacation_id) VALUES ("${req.user.id}", "${req.body.vacation_id}");`
    try {
        await myQuery(qry)
        res.status(201).json({ err: false, msg: `follow added successfully` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})


// deleting followed vacation for specific user
router.delete('/follow', [vtUser, permission("user")], async (req, res) => {
    const qry = `DELETE FROM follow WHERE
    user_id = "${req.user.id}" AND vacation_id = "${req.body.vacation_id}"; `
    try {
        const query_report = await myQuery(qry)
        // check if this record existed in the db
        if (query_report.affectedRows)
            return res.status(201).json({ err: false, msg: `follow deleted successfully` })
        res.status(202).json({ err: true, msg: `there is nothing to delete ` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})


// adding new vacation 🏖
router.post('/update', [vtUser, permission("admin")], async (req, res) => {
    try {
        const { img, price, first_day, last_day, description } = req.body
        if (!img || !price || !first_day || !last_day || !description)
            return res.status(400).json({ err: true, msg: 'missing some info' })
        const qry = `INSERT INTO vacations(img, price, first_day, last_day, description)
    values("${img}", "${price}", "${first_day}", "${last_day}", "${description}");`
        const query_report = await myQuery(qry)
        res.status(201).json({ err: false, msg: query_report.insertId })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})

// deleting vacation 🏖
router.delete('/update', [vtUser, permission("admin")], async (req, res) => {
    try {
        const { id } = req.body
        if (!id)
            return res.status(400).json({ err: true, msg: 'missing some info' })
        const qry = `DELETE FROM vacations WHERE id = ${id};`
        await myQuery(qry)
        res.status(201).json({ err: false, msg: `vacation ${id} deleted` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})

// updating a vacation 🏖
router.put('/update', [vtUser, permission("admin"), updateFormat], async (req, res) => {
    try {
        // this long query has build at "updateFormat" middleware
        await myQuery(req.query)
        res.status(201).json({ err: false, msg: `vacation update successfully` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})


module.exports = router