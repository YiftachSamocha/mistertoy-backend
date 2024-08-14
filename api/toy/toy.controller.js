import { toyService } from "./toy.service.js";
import { loggerService } from "../../services/logger.service.js";

export async function getToys(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
            inStock: req.query.inStock || 'all',
            labels: req.query.labels || [],
            sort: req.query.sort || 'name',
        }
        const toys = await toyService.query(filterBy)
        res.json(toys)
    }
    catch (err) {
        loggerService.error('Cannot load toys', err)
        res.status(400).send('Cannot load toys')
    }

}

export async function getToyById(req, res) {
    try {
        const { id } = req.params
        const foundToy = await toyService.getById(id)
        res.json(foundToy)
    }
    catch (err) {
        loggerService.error('Cannot get toy', err)
        res.status(400).send('Cannot get toy')

    }
}

export async function updateToy(req, res) {
    try {
        const { ...toy } = req.body
        const savedToy = await toyService.update(toy)
        res.json(savedToy)
    }
    catch (err) {
        loggerService.error('Cannot update toy', err)
        res.status(400).send('Cannot update toy')
    }
}

export async function addToy(req, res) {
    try {
        const { ...toy } = req.body
        const savedToy = await toyService.add(toy)
        res.json(savedToy)
    }
    catch (err) {
        loggerService.error('Cannot add toy', err)
        res.status(400).send('Cannot add toy')
    }
}

export async function removeToy(req, res) {
    try {
        const { id } = req.params
        await toyService.remove(id)
        res.send('Toy has been deleted')
    }
    catch (err) {
        loggerService.error('Cannot remove toy', err)
        res.status(400).send('Cannot remove toy')
    }

}

export async function addToyMsg(req, res) {
    try {
        const { ...msg } = req.body
        await toyService.addMsg(msg)
        res.send('Message has been added successfully')
    }
    catch (err) {
        loggerService.error('Cannot add message', err)
        res.status(400).send('Cannot add message')
    }
}