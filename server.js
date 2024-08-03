import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loggerService } from './services/logger.service.js';
import { userService } from './api/auth/user.service.js';
import { toyRoutes } from './api/toy/toy.routes.js';

const app = express()
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',

        'http://127.0.0.1:5173',
        'http://localhost:5173',

        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true
}

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))


app.use('/api/toy', toyRoutes)


//USER
app.post('/api/auth/login', (req, res) => {
    const { ...credentials } = req.body
    userService.login(credentials)
        .then(foundUser => res.send(foundUser))
        .catch((err) => {
            loggerService.error('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const { ...credentials } = req.body
    userService.signup(credentials)
        .then(savedUser => res.send(savedUser))
        .catch((err) => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.send('Logged out!')
})



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)

//mongodb+srv://yiftachsamo:019283746qQ@cluster0.v1iqfqg.mongodb.net/
