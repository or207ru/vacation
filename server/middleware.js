const jwt = require('jsonwebtoken')
const { myQuery, dateFormation } = require('./db')

// verify token authentication and decrypting the token into the body
const vtUser = (req, res, next) => {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ err: true, msg: err.message })
        req.user = payload
        next()
    })
}

// counting the amount of followers for followed vacations
const followers = async (req, res, next) => {
    try {
        const query = await myQuery(`SELECT vacation_id as vac, COUNT(vacation_id) as cou
        FROM follow GROUP BY vacation_id;`)
        const edited_query = {}
        query.forEach(item => {
            edited_query[item.vac] = item.cou
        })
        req.followers = edited_query
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json(({ err: true, msg: err }))
    }
}

// manage allowed actions for users and admin
const permission = (role) => {
    return async (req, res, next) => {
        if (role !== req.user.role)
            return res.status(403).json({ err: true, msg: "you are not allowed for this action" })
        next()
    }
}

const updateFormat = async (req, res, next) => {
    // reciving info from the body and asserting id existance
    const { id, img, price, first_day, last_day, description } = req.body
    if (!id)
        return res.status(400).json({ err: true, msg: 'missing vacation id' })
    const old_row_query = await myQuery(`SELECT * FROM vacations WHERE id = "${id}"`)
    const old_row = old_row_query[0]
    // building the query, at any step check if current value exist and if not so placing the original value
    let qry = `UPDATE vacations SET `
    qry += img ? `img = "${img}", ` : `img = "${old_row.img}", `
    qry += price ? `price = "${price}", ` : `price = "${old_row.price}", `
    qry += first_day ? `first_day = "${first_day}", ` : `first_day = "${dateFormation(old_row.first_day)}", `
    qry += last_day ? `last_day = "${last_day}", ` : `last_day = "${dateFormation(old_row.last_day)}", `
    qry += description ? `description = "${description}" ` : `description = "${old_row.description}" `
    qry += `WHERE id = ${id}`
    req.query = qry
    next()
}

module.exports = { vtUser, followers, permission, updateFormat }