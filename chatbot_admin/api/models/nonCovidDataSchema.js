//Schema to hold all questions asked by user that are non-covid related

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nonCovidDataSchema = new Schema({
    question: { type: String }
});

const nonCovidData = mongoose.model('noncovidquestion', nonCovidDataSchema);
module.exports = nonCovidData;