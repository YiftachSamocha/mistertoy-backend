import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const reviewService = { query, getById, remove, add, update }


async function query(filterBy = {}) {
    try {
        const criteria = {}
        // if (filterBy.name) {
        //     criteria.name = { $regex: filterBy.name, $options: 'i' }
        // }
        // if (filterBy.inStock) {
        //     if (filterBy.inStock === 'in') criteria.inStock = true
        //     else if (filterBy.inStock === 'out') criteria.inStock = false
        // }
        // let sortType = 'name'
        // if (filterBy.sort) {
        //     switch (filterBy.sort) {
        //         case 'name': sortType = 'name'
        //             break
        //         case 'price': sortType = 'price'
        //             break
        //         case 'date': sortType = 'createdAt'
        //             break
        //     }
        // }
        // if (filterBy.labels && filterBy.labels.length !== 0) {
        //     criteria.labels = { $in: filterBy.labels }
        // }

        const collection = await dbService.getCollection('review')
        const reviews = await collection.find().toArray()
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
        const reviewToAdd= {
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




