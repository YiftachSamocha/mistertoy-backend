import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const authService = { login, signup, getLoginToken, validateToken }
_createData()

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(userToFind) {
    try {
        const { username, password } = userToFind
        const collection = await dbService.getCollection('user')
        const foundUser = await collection.findOne({ $and: [{ username }, { password }] })
        return _minimalizeUser(foundUser)
    }
    catch (err) {
        loggerService.error('Cannot log in', err)
        throw err
    }
}

async function signup(userToAdd) {
    try {
        const collection = await dbService.getCollection('user')
        userToAdd.createdAt = new Date()
        await collection.insertOne(userToAdd)
        return _minimalizeUser(userToAdd)
    } catch (err) {
        loggerService.error('Cannot sign up', err)
        throw err
    }

}

function getLoginToken(user) {
    const userInfo = _minimalizeUser(user)
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function _minimalizeUser(user) {
    return {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
}

async function _createData(length = 5) {
    const collection = await dbService.getCollection('user')
    const documentsCount = await collection.countDocuments()
    if (documentsCount === 0) {
        const user = {
            fullname: _getRandomAnimal(),
            password: _getRandomAnimal(),
            username: _getRandomAnimal(),
            isAdmin: true,
        }
        await collection.insertOne(user)
        for (var i = 0; i < length; i++) {
            const user = {
                fullname: _getRandomAnimal(),
                password: _getRandomAnimal(),
                username: _getRandomAnimal(),
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
