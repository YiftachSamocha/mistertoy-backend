import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const userService = { query, getById, remove, add, update, createData }

async function query() {
    try {
        const collection = await dbService.getCollection('user')
        const users = await collection.find().toArray()
        return users
    } catch (err) {
        loggerService.error('Cannot find users', err)
        throw err
    }
}


async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
    }
    catch (err) {
        loggerService.error('Cannot remove user', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const foundUser = await collection.findOne({ _id: ObjectId.createFromHexString(userId) })
        foundUser.createdAt = foundUser._id.getTimestamp()
        return foundUser
    }
    catch (err) {
        loggerService.error('Cannot find user', err)
        throw err
    }
}

async function add(userToAdd) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    }
    catch (err) {
        loggerService.error('Cannot add user', err)
        throw err
    }
}

async function update(userToUpdate) {
    try {
        const collection = await dbService.getCollection('user')
        const userId = userToUpdate._id
        delete userToUpdate._id
        await collection.updateOne({ _id: ObjectId.createFromHexString(userId.toString()) }, { $set: { ...userToUpdate } })
        userToUpdate._id = userId
        return userToUpdate

    } catch (err) {
        loggerService.error('Cannot update user', err)
        throw err
    }
}


async function createData(length = 5) {
    const collection = await dbService.getCollection('user')
    const documentsCount = await collection.countDocuments()
    if (documentsCount === 0) {
        const user = {
            fullname: _getRandomAnimal(),
            password: _getRandomAnimal(),
            username: _getRandomAnimal(),
            reviews: [],
            createdAt: new Date(),
            isAdmin: true,
        }
        await collection.insertOne(user)
        for (var i = 0; i < length; i++) {
            const user = {
                fullname: _getRandomAnimal(),
                password: _getRandomAnimal(),
                username: _getRandomAnimal(),
                reviews: [],
                createdAt: new Date(),
            }
            await collection.insertOne(user)
        }
    }
}

function _getRandomAnimal() {
    const animalNames = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Panda", "Koala", "Penguin", "Dolphin", "Shark", "Eagle", "Wolf", "Bear"];
    const randomIndex = Math.floor(Math.random() * animalNames.length)
    return animalNames[randomIndex]
}


