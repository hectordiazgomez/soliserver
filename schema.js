const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const retrieveOnlySchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    scrapeTime: { type: String, required: true },
});

const customTaskSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    prompt: { type: String, required: true },
    scrapeTime: { type: String, required: true },
});

module.exports = {
    RetrieveOnly: mongoose.model('RetrieveOnly', retrieveOnlySchema),
    CustomTask: mongoose.model('CustomTask', customTaskSchema),
};
