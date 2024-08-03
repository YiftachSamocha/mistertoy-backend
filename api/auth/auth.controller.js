import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"

export async function login(req, res) {
    try {
        const { ...credentials } = req.body
        const foundUser = await authService.login(credentials)
        res.json(foundUser)
    }
    catch (err) {
        loggerService.error('Cannot login', err)
        res.status(400).send('Cannot login')
    }
}

export async function signup(req, res) {
    try {
        const { ...credentials } = req.body
        const savedUser = await authService.signup(credentials)
        res.json(savedUser)
    }

    catch (err) {
        loggerService.error('Cannot signup', err)
        res.status(400).send('Cannot signup')
    }
}

export function logout(req, res) {
    res.json('Logged out!')
}