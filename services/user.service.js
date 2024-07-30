import fs from 'fs'
import { loggerService } from "./logger.service.js"
import { utilService } from "./util.service.js"

export const userService = { login, signup }
const users = utilService.readJsonFile('data/user.json')

function login(userToFind) {
    const foundUser = users.find(user => user.password === userToFind.password && user.username === userToFind.username)
    const userToSend = { _id: foundUser._id, fullname: foundUser.fullname }
    return Promise.resolve(userToSend)
}

async function signup(userToAdd) {
    userToAdd._id = utilService.makeId()
    userToAdd.createdAt = new Date()
    users.push(userToAdd)
    await _saveUsersToFile()
    return { _id: userToAdd._id, fullname: userToAdd.fullname }


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