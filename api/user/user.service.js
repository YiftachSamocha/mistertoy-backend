import fs from 'fs'
import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"

export const userService = { login, signup }
let users = utilService.readJsonFile('data/user.json')
_createData()

function login(userToFind) {
    const foundUser = users.find(user => user.password === userToFind.password && user.username === userToFind.username)
    const userToSend = { _id: foundUser._id, fullname: foundUser.fullname, isAdmin: foundUser.isAdmin }
    return Promise.resolve(userToSend)
}

async function signup(userToAdd) {
    userToAdd._id = utilService.makeId()
    userToAdd.createdAt = new Date()
    users.push(userToAdd)
    await _saveUsersToFile()
    return { _id: userToAdd._id, fullname: userToAdd.fullname }


}

async function _createData(length = 6) {
    if (!users || users.length === 0) {
        let newUsers = []
        for (var i = 0; i < length; i++) {
            const user = {
                _id: utilService.makeId(),
                fullname: _getRandomAnimal(),
                password: _getRandomAnimal(),
                username: _getRandomAnimal(),
            }
            newUsers.push(user)
        }
        newUsers[0].isAdmin = true
        users = newUsers
        await _saveUsersToFile()
    }

}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to users file', err)
                return reject(err)
            }
            resolve()
        })
    })
}


function _getRandomAnimal() {
    const animalNames = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Panda", "Koala", "Penguin", "Dolphin", "Shark", "Eagle", "Wolf", "Bear"];
    const randomIndex = Math.floor(Math.random() * animalNames.length)
    return animalNames[randomIndex]
}
