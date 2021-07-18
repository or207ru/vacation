const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'global_vacation'
});
const MILISECOND_IN_DAY = 1000 * 60 * 60 * 24

connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
})

// making the query to work with promis
const myQuery = (qry) => {
    return new Promise((resolve, reject) => {
        connection.query(qry, (err, results) => {
            err ? reject(err) : resolve(results)
        })
    })
}

// preserve of the same format as inserted un the db
const dateFormation = (date) => {
    date = new Date(Date.parse(date) + MILISECOND_IN_DAY)
    return date.toISOString().substr(0, 10)
}

module.exports = { myQuery, dateFormation }
























// const dateFormation = (date, toIso = false) => {
//     if (toIso)
//         date = date.toIsoString()
//     date = Date.parse(date) + MILISECOND_IN_DAY
//     date = new Date(date)
//     return date.toISOString().substr(0, 10)
//     return date
// }