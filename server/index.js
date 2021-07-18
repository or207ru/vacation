const express = require("express")
const dotenv = require("dotenv")
require("./db")


dotenv.config()
const app = express()
app.use(require('cors')())
const port = 1000


app.use(express.json())
app.use('/api/users', require("./routs/users"))
app.use('/api/vacations', require("./routs/vacations"))


app.listen(port, () => {
    console.log(`hii from port ${port}`)
})