const auth = require('../auth');
const Top5List = require('../models/top5list-model');

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

        top5List
            .save()
            .then(() => {
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
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            top5List.name = body.name
            top5List.items = body.items
            top5List.isPublished = body.isPublished
            if (top5List.isPublished) {
                top5List.publishDate = Date.now()
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
        })
    })
}

deleteTop5List = async (req, res) => {
    auth.verify(req, res, async function () {
        Top5List.findById({ _id: req.params.id }, (err, top5List) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                return res.status(200).json({ success: true, data: top5List })
            }).catch(err => console.log(err))
        })
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
            let top5ListArr = filterTop5Lists(top5Lists, req)
            console.log('Found ' + top5ListArr.length + ' list(s) ' + JSON.stringify(req.body))
            return res.status(200).json({ success: true, top5Lists: top5ListArr });
        }
    }).catch(err => console.log(err))
}

filterTop5Lists = function(top5Lists, req) {
    const { owner, query, queryType } = req.body
    let resultList = []
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
        };
        switch (queryType) {
            case 'HOME':
                if (list.owner === owner) {
                    resultList.push(top5List)
                }
                break;
            case 'ALL_LISTS':
                if (list.name.includes(query)) {
                    resultList.push(top5List);
                }
                break;
            case 'USERS':
                if (list.owner.includes(query)) {
                    resultList.push(top5List);
                }
                break;
        }
    }
    return resultList
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById
}