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
            userId: ObjectId.createFromHexString(review.userId),
        }
        const collection = await dbService.getCollection('review')
        const { insertedId } = await collection.insertOne(reviewToAdd)

        // Fetch the user and toy related to the review
        const userCollection = await dbService.getCollection('user')
        const toyCollection = await dbService.getCollection('toy')

        const byUser = await userCollection.findOne({ _id: reviewToAdd.userId })
        const aboutToy = await toyCollection.findOne({ _id: reviewToAdd.toyId })
        const addedReview = {
            _id: insertedId,
            txt: reviewToAdd.txt,
            byUser: {
                _id: byUser._id,
                fullname: byUser.fullname,
            },
            aboutToy: {
                _id: aboutToy._id,
                name: aboutToy.name,
            },
            createdAt: insertedId.getTimestamp(),
        }

        return addedReview

    } catch (err) {
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

        // Fetch the user and toy related to the review
        const userCollection = await dbService.getCollection('user')
        const toyCollection = await dbService.getCollection('toy')

        const byUser = await userCollection.findOne({ _id: ObjectId.createFromHexString(reviewToUpdate.userId.toString()) }, { projection: { fullname: 1 } })
        const aboutToy = await toyCollection.findOne({ _id: ObjectId.createFromHexString(reviewToUpdate.toyId.toString()) }, { projection: { name: 1 } })

        const updatedReview = {
            _id: ObjectId.createFromHexString(reviewId.toString()),
            txt: reviewToUpdate.txt,
            byUser: {
                _id: byUser._id,
                fullname: byUser.fullname,
            },
            aboutToy: {
                _id: aboutToy._id,
                name: aboutToy.name,
            },
            createdAt: ObjectId.createFromHexString(reviewId.toString()).getTimestamp(),
        }

        return updatedReview

    } catch (err) {
        loggerService.error('Cannot update review', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        criteria.txt = { $regex: filterBy.txt, $options: 'i' }
    }
    if (filterBy.toy) {
        criteria.toyId = ObjectId.createFromHexString(filterBy.toy)
    }
    if (filterBy.user) {
        criteria.userId = ObjectId.createFromHexString(filterBy.user)
    }
    return criteria
}




