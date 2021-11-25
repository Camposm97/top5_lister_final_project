const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityItem = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true }
})

module.exports = mongoose.model(
    'CommunityItem', CommunityItem
)