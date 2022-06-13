/*===================================
THIS IS A TEMPORARY FILE TO POPULATE 
DATABASE DURING DEVELOPMENT
=====================================*/

const Question = require('../models/questionSchema')
const dataSet = require('./dataSet.json')
require('../connections/db')

//populates database with preset covid-19 datasets

Question.create(dataSet, (err, arr) => {
    if (err) throw err
})




