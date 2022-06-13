const Question = require('../../models/questionSchema')
const NewQuestion = require('../../models/newQuestionSchema')
const webhook = require('./webhook')

module.exports = {
    async dataSet(req, res) { //sends question data to client side js
        try {
            let qData = await Question.find()
            res.json(qData)
        } catch (err) { console.error(err) }
    },
    async saveNewQuestion(req, res) { //creates new question instance in database
        try {
            await NewQuestion.create(req.body)
            const url = await webhook.search(req.body.question) //searches nhs website for helpful links
            if(!url){
                res.end()
            }else{
                res.send(url)
            } 
        } catch (err) { console.error(err) }
    }
}

