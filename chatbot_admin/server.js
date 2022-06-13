//Server for ChatBot Admin
const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')

require('./api/connections/db')//links database api

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./app/public'))

const PORT = process.env.PORT || 5006

const htmlRoutes = require('./app/routes/htmlRoutes')
app.use('/', htmlRoutes)

const apiRoutes = require('./api/routes/dbRoutes')
app.use('/api', apiRoutes)

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, "./app/public/html/error.html"))
})

app.listen(PORT, function() {
    console.log("************* ChatBot_Admin is running ****************")
    console.log("App listening on PORT " + PORT)
})

// For app termination
const gracefulShutdown = (msg,callback)=>{
    console.log(`Application disconnected through ${msg}`)
    callback()
   }
process.on('SIGINT',()=>{
    gracefulShutdown('app termination', ()=>{
    process.exit(0)
    })
   })