import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loggerService } from './services/logger.service.js';
import { toyService } from './services/toy.service.js';

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

app.get('/api/toy', (req, res) => {
    const filterBy = {
        name: req.query.name || '',
        isStock: req.query.isStock || 'all',
        labels: req.query.labels || [],
        sort: req.query.sort || 'name',
    }
    toyService.query()
        .then(toys => res.send(toys))

})



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
