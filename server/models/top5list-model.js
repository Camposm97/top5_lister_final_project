const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        owner: { type: String, required: true },
        isPublished: { type: Boolean },
        publishDate: { type: Date },
        comments: { type: [{ username: String, message: String }] },
        likes: { type: [String] },
        dislikes: { type: [String] },
        views: { type: Number }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
