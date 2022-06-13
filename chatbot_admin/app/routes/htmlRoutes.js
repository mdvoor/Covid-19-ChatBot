//Routing for the serving of html files

const express = require('express')
const htmlRoutes = express.Router()
const path = require('path')

htmlRoutes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"))
})
htmlRoutes.get('/covidData', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/covidData.html"))
})
htmlRoutes.get('/nonCovidData', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/nonCovidData.html"))
})

module.exports = htmlRoutes