import { loggerService } from "../../services/logger.service.js";
import { userService } from "./user.service.js";

export async function getUsers(req, res) {
    try {
        const users = await userService.query(filterBy)
        res.json(users)
    }
    catch (err) {
        loggerService.error('Cannot load users', err)
        res.status(400).send('Cannot load users')
    }

}

export async function getUserById(req, res) {
    try {
        const { id } = req.params
        const foundUser = await userService.getById(id)
        res.json(foundUser)
    }
    catch (err) {
        loggerService.error('Cannot get user', err)
        res.status(400).send('Cannot get user')

    }
}

export async function updateUser(req, res) {
    try {
        const { ...user } = req.body
        const savedUser = await userService.update(user)
        res.json(savedUser)
    }
    catch (err) {
        loggerService.error('Cannot update user', err)
        res.status(400).send('Cannot update user')
    }
}

export async function addUser(req, res) {
    try {
        const { ...user } = req.body
        const savedUser = await userService.add(user)
        res.json(savedUser)
    }
    catch (err) {
        loggerService.error('Cannot add user', err)
        res.status(400).send('Cannot add user')
    }
}

export async function removeUser(req, res) {
    try {
        const { id } = req.params
        await userService.remove(id)
        res.send('User has been deleted')
    }
    catch (err) {
        loggerService.error('Cannot remove user', err)
        res.status(400).send('Cannot remove user')
    }
}
