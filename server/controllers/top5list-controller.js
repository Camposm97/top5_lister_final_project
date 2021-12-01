const auth = require('../auth');
const Top5List = require('../models/top5list-model');
const Top5CommunityList = require('../models/top5communitylist-model');
const { createTop5CommList, deleteCommListByName, updateTop5CommList, getTop5CommListsByName } = require('./top5communitylist-controller');

createTop5List = (req, res) => {
    try {
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a Top 5 List',
            })
        }
        const top5List = new Top5List(body);
        if (!top5List) {
            return res.status(400).json({ success: false, error: err })
        }

        top5List.save().then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Top 5 List Not Created!'
                })
            })
    } catch (err) {
        console.log(err)
    }
}

updateTop5List = async (req, res) => {
    auth.verify(req, res, async function () {
        const body = req.body
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
            if (err) {
                return res.status(404).json({ err, message: 'Top 5 List not found!' })
            } else {
                top5List.name = body.name
                top5List.items = body.items
                top5List.isPublished = body.isPublished

                if (!top5List.isPublished && body.isPublished) { // if the top5List is not published and is going to be published
                    top5List.publishDate = Date.now()
                    // Check if we should create a community list or not when a list if published
                    Top5CommunityList.findOne({
                        name: {
                            $regex: '^(' + top5List.name + ')$',
                            $options: 'i'
                        }
                    }, (err, top5CommList) => {
                        if (top5CommList) { // If the comm list exists, then update it
                            console.log('Comm List EXISTS: ' + top5CommList.name)
                            updateTop5CommList(top5CommList)
                        } else { // Else let's create a new comm list and update :D
                            console.log(body.name + ' comm list does not exist! Generating...')
                            createTop5CommList(body.name)
                        }
                    })
                }

                top5List.comments = body.comments
                top5List.likes = body.likes
                top5List.dislikes = body.dislikes
                top5List.views = body.views
                top5List.save().then(() => {
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: 'Top 5 List updated!',
                    })
                }).catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Top 5 List not updated!',
                    })
                })
            }
        })
    })
}

// TODO: Whenever we delete a published list, we update a comm list
deleteTop5List = async (req, res) => {
    auth.verify(req, res, async function () {
        // Check if the list exists for deletion
        Top5List.findById({ _id: req.params.id }, (err, top5List) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            // console.log(top5List)
            Top5List.findOneAndDelete({ _id: req.params.id }, (err, callback) => {
                if (err) {
                    return res.status(400).json({
                        err,
                        message: 'Failed to delete top 5 list ' + req.params.id,
                    })
                }
                // console.log(callback)
                if (callback) {
                    console.log('Deleted top5list ' + callback.name + ' by ' + callback.owner)
                    if (callback.isPublished) {
                        Top5List.exists({
                            name: {
                                $regex: '^(' + callback.name + ')$',
                                $options: 'i'
                            },
                            isPublished: true
                        }).then((flag) => {
                            console.log('flag=' + flag)
                            if (flag) { // Update a Community List
                                Top5CommunityList.findOne({
                                    name: {
                                        $regex: '^(' + callback.name + ')$',
                                        $options: 'i'
                                    }
                                }, (err, commList) => {
                                    if (err) {
                                        return res.status(400).json({
                                            err,
                                            message: 'Failed to delete top 5 list ' + req.params.id,
                                        })
                                    }
                                    if (commList) {
                                        updateTop5CommList(commList)
                                    }
                                })
                            } else { // Delete a Community List
                                deleteCommListByName(callback.name)
                            }
                        })
                    }
                    return res.status(200).json({ success: true, data: callback })
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}

getTop5ListPairs = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        } else {
            filterTop5Lists(top5Lists, req).then((results) => {
                console.log('Found ' + results.length + ' list(s) w/ ' + JSON.stringify(req.body))
                return res.status(200).json({ success: true, top5Lists: results });
            })
        }
    }).catch(err => console.log('fuck!'))
}

filterTop5Lists = async function (top5Lists, req) {
    const { owner, query, queryType } = req.body
    let results = []
    if (queryType === 'COMMUNITY_LISTS') {
        // await getTop5CommListsByName(results, query)
        // console.log('results=' + JSON.stringify(results))
        await Top5CommunityList.find({}, (err, callback) => {
            if (err) {
                return []
            }
            for (let key in callback) {
                let list = callback[key]
                let commList = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    latestUpdate: list.latestUpdate,
                    comments: list.comments,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    views: list.views
                }
                let flag = commList.name.toLowerCase().includes(query.toLowerCase())
                console.log('name=' + commList.name.toLowerCase()
                    + ', query=' + query
                    + ', includes=' + (flag))
                if (flag) {
                    // console.log(commList)
                    results.push(commList)
                }
            }
        })
    } else {
        for (let key in top5Lists) {
            let list = top5Lists[key];
            let top5List = {
                _id: list._id,
                name: list.name,
                items: list.items,
                owner: list.owner,
                isPublished: list.isPublished,
                publishDate: list.publishDate,
                comments: list.comments,
                likes: list.likes,
                dislikes: list.dislikes,
                views: list.views
            }
            switch (queryType) {
                case 'HOME':
                    if (list.owner === owner) {
                        results.push(top5List)
                    }
                    break;
                case 'ALL_LISTS':
                    if (list.name.toLowerCase().includes(query.toLowerCase()) && list.isPublished) {
                        results.push(top5List);
                    }
                    break;
                case 'USERS':
                    if (list.owner.toLowerCase().includes(query.toLowerCase()) && list.isPublished) {
                        results.push(top5List);
                    }
                    break;
            }
        }
    }
    return results
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById
}