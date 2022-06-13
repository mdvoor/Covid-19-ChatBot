const Questions = require('../../models/questionSchema')
const NewQuestions = require('../../models/newQuestionSchema')
const NonCovidData = require('../../models/nonCovidDataSchema')
const path = require('path')

module.exports = {
    async updateDB(req, res) { //updates questions database with answers to NewQuestions
        try {
            let data = req.body
            let usrQ = await NewQuestions.findById(data.questionID)
            if (data.relevant == 'true') {
                let questionObj = { question: usrQ.question, answer: data.answer }
                await Questions.create(questionObj)
            }else{
                let newR = await NonCovidData.create({"question":usrQ.question})
            }
            await NewQuestions.deleteOne({ _id: data.questionID }, (err) => { if (err) throw err })
            res.sendFile(path.join(__dirname, "../../../app/public/html/index.html"))
        } catch (err) { console.error(err) }
    },
    async newQuestionsData(req, res) { //sends new question data to populate admin form
        try {
            let newQ = await NewQuestions.find()
            res.json(newQ)
        } catch (err) { console.error(err) }
    },
    async covidData(req, res) { //sends all covid data to Covid-19 table page
        try {
            let data = await Questions.find()
            res.json(data)
        } catch (err) { console.error(err) }
    },
    async nonCovidData(req,res){ //sends all covid data to Non-Covid table page
        try {
            let data = await NonCovidData.find()
            res.json(data)
        } catch (err) { console.error(err) }
    },
    async dbRecord(req, res) { //finds specific record
        try {
            let record = await Questions.findById(req.body.id)
            res.json(record)
        } catch (err) { console.error(err) }
    },
    async editDB(req, res) { //edits specific record
        try {
            let edit = req.body
            await Questions.updateOne({ _id: edit._id }, { $set: { question: edit.question, answer: edit.answer } })
            res.sendFile(path.join(__dirname, "../../../app/public/html/covidData.html"))
        } catch (err) { console.error(err) }
    },
    async deleteRecord(req, res) { //deletes specific record
        try {
            await Questions.deleteOne({ _id: req.params.id }, (err) => { if (err) throw err })
            res.sendFile(path.join(__dirname, "../../../app/public/html/covidData.html"))
        } catch (err) { console.error(err) }
    },
    async deleteNonCovid(req,res){
        try {
            await NonCovidData.deleteOne({ _id: req.params.id }, (err) => { if (err) throw err })
            res.sendFile(path.join(__dirname, "../../../app/public/html/nonCovidData.html"))
        } catch (err) { console.error(err) }
    }
}

