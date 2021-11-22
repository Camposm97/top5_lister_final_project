const Top5CommunityList = require('../models/top5communitylist-model')

getAllCommunityListsByName = async (req, res) => {
    const docs = await Top5CommunityList.find({ name: req.body.name })
    return res.status(200).json({ communitylists: docs })
}

updateCommunityList = async (req, res) => {
    return res.status(200).json({ message: 'yup' })
}

module.exports = {
    getAllCommunityListsByName,
    updateCommunityList
}