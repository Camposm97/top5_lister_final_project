const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [{ String, Number }], required: true },
        latestUpdate: { type: Date },
        comments: { type: [String] },
        likes: { type: [String] },
        dislikes: { type: [String] },
        views: { type: Number }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5CommunityList', Top5CommunityListSchema)
