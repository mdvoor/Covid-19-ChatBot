//Routing for calls that access the database

const express = require('express')
const controller = require('../routes/controllers/dbControllers')
const dbRoutes = express.Router()


dbRoutes.get('/newQuestionsData', controller.newQuestionsData)//populates data for the New Questions Admin Form

dbRoutes.post('/updateDB', controller.updateDB)//updates Questions DB with new questions

dbRoutes.get('/covidData', controller.covidData)//requests all data from Questions DB

dbRoutes.get('/nonCovidData', controller.nonCovidData)//requests all data from Questions DB

dbRoutes.post('/dbRecord', controller.dbRecord)//requests single record from NonCovidQuestion DB

dbRoutes.post('/editDB', controller.editDB)//edits Questions DB

dbRoutes.get('/deleteRecord/:id', controller.deleteRecord)//deletes record from Questions DB

dbRoutes.get('/deleteNonCovid/:id', controller.deleteNonCovid)//deletes record from NonCovidQuestions DB

module.exports = dbRoutes

