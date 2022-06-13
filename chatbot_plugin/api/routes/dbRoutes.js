const express = require('express')
const controller = require('../routes/controllers/dbControllers')
const dbRoutes = express.Router()

dbRoutes.get('/dataSet', controller.dataSet)//retrieves covid data from Database

dbRoutes.post('/saveNewQuestion', controller.saveNewQuestion)//saves new questions into NewQuestions Database, searches for additonal links

module.exports = dbRoutes

