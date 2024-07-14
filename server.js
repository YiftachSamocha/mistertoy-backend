import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loggerService } from './services/logger.service.js';
import { toyService } from './services/toy.service.js';
import { userService } from './services/user.service.js';

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


// TOYS
app.get('/api/toy', (req, res) => {
    const filterBy = {
        name: req.query.name || '',
        inStock: req.query.inStock || 'all',
        labels: req.query.labels || [],
        sort: req.query.sort || 'name',
    }
    toyService.query(filterBy)
        .then(toys => res.send(toys))
        .catch((err) => {
            loggerService.error('Cannot load toys', err)
            res.status(400).send('Cannot load toys')
        })

})

app.get('/api/toy/:id', (req, res) => {
    const { id } = req.params
    toyService.getById(id)
        .then(foundToy => res.send(foundToy))
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })

})

app.put('/api/toy', (req, res) => {
    const { ...toy } = req.body
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch((err) => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })
})

app.post('/api/toy', (req, res) => {
    const { ...toy } = req.body
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch((err) => {
            loggerService.error('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

app.delete('/api/toy/:id', (req, res) => {
    const { id } = req.params
    toyService.remove(id)
        .then(() => res.send('Removed successfully'))
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })

})

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



const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
