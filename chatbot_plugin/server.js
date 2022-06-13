//Server for ChatBot Plugin
const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')

require('./api/connections/db')//links database api

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./app/public'))

const PORT = process.env.PORT || 5005

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, "./app/public/html/index.html"))//serves index page
})

const apiRoutes = require('./api/routes/dbRoutes')//links database api routes
app.use('/api', apiRoutes)

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, "./app/public/html/error.html"))//serves 404 error page

})

app.listen(PORT, function () {
    console.log("*************** ChatBot PLUGIN is running ****************")
    console.log("App listening on PORT " + PORT)
})

// For app termination
const gracefulShutdown = (msg, callback) => {
    console.log(`Application disconnected through ${msg}`)
    callback()
}
process.on('SIGINT', () => {
    gracefulShutdown('App termination', () => {
        process.exit(0)
    })
})