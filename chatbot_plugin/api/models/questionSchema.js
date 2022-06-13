//Schema to hold all questiona and answer sets relevant to covid-19

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
    question: { type: String },
    answer: { type: String },
})

const Question = mongoose.model('question', questionSchema)

module.exports = Question