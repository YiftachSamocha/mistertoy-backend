import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const reviewService = { query, getById, remove, add, update }


async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')

        var reviews = await collection.aggregate([
            { $match: criteria },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            { $unwind: '$byUser' },
            {
                $lookup: {
                    from: 'toy',
                    localField: 'toyId',
                    foreignField: '_id',
                    as: 'aboutToy',
                },
            },
            { $unwind: '$aboutToy' },
        ]).toArray()

        reviews = reviews.map(review => {
            review.byUser = {
                _id: review.byUser._id,
                fullname: review.byUser.fullname
            }
            review.aboutToy = {
                _id: review.aboutToy._id,
                name: review.aboutToy.name
            }
            review.createdAt = review._id.getTimestamp()
            delete review.userId
            delete review.toyId
            return review
        })

        return reviews

    } catch (err) {
        loggerService.error('Cannot find reviews', err)
        throw err
    }
}



async function remove(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(reviewId) })
    }
    catch (err) {
        loggerService.error('Cannot remove review', err)
        throw err
    }
}

async function getById(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const foundReview = await collection.findOne({ _id: ObjectId.createFromHexString(reviewId) })
        foundReview.createdAt = foundReview._id.getTimestamp()
        return foundReview
    }
    catch (err) {
        loggerService.error('Cannot find review', err)
        throw err
    }
}

async function add(review) {
    try {
        const reviewToAdd = {
            txt: review.txt,
            toyId: ObjectId.createFromHexString(review.toyId),
            userId: ObjectId.createFromHexString(review.userId)
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    }
    catch (err) {
        loggerService.error('Cannot add review', err)
        throw err
    }
}

async function update(reviewToUpdate) {
    try {
        const collection = await dbService.getCollection('review')
        const reviewId = reviewToUpdate._id
        delete reviewToUpdate._id
        await collection.updateOne({ _id: ObjectId.createFromHexString(reviewId.toString()) }, { $set: { ...reviewToUpdate } })
        reviewToUpdate._id = reviewId
        return reviewToUpdate

    } catch (err) {
        loggerService.error('Cannot update review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.toy) {
        criteria.toyId = ObjectId.createFromHexString(filterBy.toy)
    }
    if (filterBy.user) {
        criteria.userId = ObjectId.createFromHexString(filterBy.user)
    }
    return criteria
}




