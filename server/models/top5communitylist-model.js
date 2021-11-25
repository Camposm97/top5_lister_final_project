const mongoose = require('mongoose')
const CommunityItem = require('./communityitem-model').schema
const Schema = mongoose.Schema



const Top5CommunityListSchema = new Schema({
    name: { type: String, required: true },
    items: { type: [CommunityItem], required: true },
    latestUpdate: { type: Date, required: true },
    comments: { type: [{ username: String, message: String }] },
    likes: { type: [String] },
    dislikes: { type: [String] },
    views: { type: Number }
}, { timestamps: true })

module.exports = mongoose.model('Top5CommunityList', Top5CommunityListSchema)
