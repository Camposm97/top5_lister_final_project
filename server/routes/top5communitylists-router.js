const auth = require('../auth')
const express = require('express')
const router = express.Router()
const Top5CommunityListController = require('../controllers/top5communitylist-controller')

router.put('/top5communitylists/:id', Top5CommunityListController.updateTop5CommListById)

module.exports = router