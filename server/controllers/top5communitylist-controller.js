const Top5CommunityList = require('../models/top5communitylist-model')
const Top5List = require('../models/top5list-model')
const CommunityItem = require('../models/communityitem-model')

function createTop5CommList(name) {
    const top5CommList = new Top5CommunityList({
        name: name,
        items: [], // TO BE COMPUTED
        latestUpdate: Date.now(),
        comments: [],
        likes: [],
        dislikes: [],
        views: 0
    })
    top5CommList.save().then(() => {
        console.log('Created comm list ' + top5CommList.name)
        console.log('Updating ' + top5CommList.name + ' comm list...')
        updateTop5CommList(top5CommList)
    })
}

// async function getTop5CommListsByName(results, query) {
//     await Top5CommunityList.find({}, (err, callback) => {
//         if (err) {
//             console.log('shit')
//         }
//         if (callback) { // Return comm lists that contains query
//             // console.log('callback=' + JSON.stringify(callback))
//             for (let key in callback) {
//                 let list = callback[key]
//                 let commList = {
//                     _id: list._id,
//                     name: list.name,
//                     items: list.items,
//                     latestUpdate: list.latestUpdate,
//                     comments: list.comments,
//                     likes: list.likes,
//                     dislikes: list.dislikes,
//                     views: list.views
//                 }
//                 let flag = commList.name.toLowerCase().includes(query.toLowerCase())
//                 console.log('name=' + commList.name.toLowerCase() + ', query=' + query + ', includes=' + (flag))
//                 if (flag) {
//                     // console.log(commList)
//                     results.push(commList)
//                 }
//             }
//         }
//         // console.log('results=' + JSON.stringify(results))
//     }).catch(err => console.log('faq'))
// }

function updateTop5CommList(top5CommList) {
    Top5List.find({
        name: {
            $regex: '^(' + top5CommList.name + ')$',
            $options: 'i'
        },
        isPublished: true
    }, (err, top5Lists) => {
        // console.log(top5Lists)
        if (err) {
            console.log('Shit')
        }
        if (top5Lists) {
            top5CommList.items = computeItemScores(top5Lists)
            Top5CommunityList.findOne({
                name: {
                    $regex: '^(' + top5CommList.name + ')$',
                    $options: 'i'
                }
            }, (err, srcList) => {
                if (err) {
                    console.log('Fuuuuu')
                }
                if (srcList) {
                    srcList.name = top5CommList.name
                    srcList.items = top5CommList.items
                    srcList.latestUpdate = Date.now()
                    srcList.comments = top5CommList.comments
                    srcList.likes = top5CommList.likes
                    srcList.dislikes = top5CommList.dislikes
                    srcList.views = top5CommList.views
                    srcList.save().then(() => {
                        console.log('Saved Comm List: ')
                        console.log(srcList)
                    })
                }
            })
        }
        // else 
        // { // No lists exist with same name of comm list, so delete it
        //     Top5CommunityList.findOneAndDelete({
        //         name: {
        //             $regex: '^(' + top5CommList.name + ')$',
        //             $options: 'i'
        //         }
        //     }, (err, srcList) => {
        //         console.log('Deleted Comm List: ' + JSON.stringify(srcList))
        //     })
        // }
    })
}

updateTop5CommListById = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
        })
    }
    Top5CommunityList.findOne({ _id: body._id }, (err, callback) => {
        if (err) {
            console.log(err)
        }
        if (callback) {
            callback.likes = body.likes
            callback.dislikes = body.dislikes
            callback.views = body.views
            callback.comments = body.comments
            // console.log('updating comm list')
            callback.save().then(() => {
                // console.log('yeeee')
                return res.status(200).json({
                    success: true,
                    message: 'Comm List Updated!'
                })
            }).catch(error => {
                // console.log('ahhh')
                return res.status(400).json({
                    success: true,
                    error,
                    message: 'Failed to update comm list'
                })
            })
        }
    })
}

function deleteCommListByName(name) {
    Top5CommunityList.findOneAndDelete({
        name: {
            $regex: '^(' + name + ')$',
            $options: 'i'
        }
    }, (err, commList) => {
        if (err) {
            console.log('something went wrong deleteing comm list')
        }
        if (commList) { // Check commList if null
            console.log('Deleted comm list ' + name)
        } else {
            console.log('Failed to delete comm list ' + name)
        }
    })
}

function computeItemScores(top5Lists) {
    let scores = []
    for (let key in top5Lists) {
        let list = top5Lists[key]
        let points = 5
        for (i in list.items) {
            let item = list.items[i]
            // console.log(item + ', ' + (points))
            if (scores[item] !== undefined) {
                scores[item] = scores[item] + points
            } else {
                scores[item] = points
            }
            points--
        }
    }
    let scoresArr = []
    for (key in scores) scoresArr.push({
        item: key,
        score: scores[key]
    })
    scoresArr = scoresArr.sort((a, b) => {
        a = a.score
        b = b.score
        return a > b ? -1 : (a < b ? 1 : 0)
    })
    console.log(scoresArr)
    scoresArr = scoresArr.slice(0, 5) // Get 5 items with the most points
    scoresArr = scoresArr.map(x => {
        return new CommunityItem({
            name: x.item,
            score: x.score
        })
    })
    console.log(scoresArr)
    return scoresArr
}

module.exports = {
    createTop5CommList,
    // getTop5CommListsByName,
    updateTop5CommList,
    updateTop5CommListById,
    deleteCommListByName,
}