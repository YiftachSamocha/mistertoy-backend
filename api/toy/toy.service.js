import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const toyService = { query, getById, remove, add, update }


async function query(filterBy = {}) {
    _createData()
    try {
        const criteria = {}
        if (filterBy.name) {
            criteria.name = { $regex: filterBy.name, $options: 'i' }
        }
        if (filterBy.inStock) {
            if (filterBy.inStock === 'in') criteria.inStock = true
            else if (filterBy.inStock === 'out') criteria.inStock = false
        }
        let sortType = 'name'
        if (filterBy.sort) {
            switch (filterBy.sort) {
                case 'name': sortType = 'name'
                    break
                case 'price': sortType = 'price'
                    break
                case 'date': sortType = 'createdAt'
                    break
            }
        }
        if (filterBy.labels && filterBy.labels.length !== 0) {
            criteria.labels = { $in: filterBy.labels }
        }

        const collection = await dbService.getCollection('toy')
        const toys = await collection.find(criteria).sort({ [sortType]: 1 }).toArray()
        return toys

    } catch (err) {
        loggerService.error('Cannot find toys', err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
    }
    catch (err) {
        loggerService.error('Cannot remove toy', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const foundToy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        foundToy.createdAt = foundToy._id.getTimestamp()
        return foundToy
    }
    catch (err) {
        loggerService.error('Cannot find toy', err)
        throw err
    }
}

async function add(toyToAdd) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toyToAdd)
        return toyToAdd
    }
    catch (err) {
        loggerService.error('Cannot add toy', err)
        throw err
    }
}

async function update(toyToUpdate) {
    try {
        const collection = await dbService.getCollection('toy')
        const toyId = toyToUpdate._id
        delete toyToUpdate._id
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId.toString()) }, { $set: { ...toyToUpdate } })
        toyToUpdate._id = toyId
        return toyToUpdate

    } catch (err) {
        loggerService.error('Cannot update toy', err)
        throw err
    }
}

async function _createData(length = 24) {
    const collection = await dbService.getCollection('toy')
    const documentCount = await collection.countDocuments()
    if (documentCount === 0) {
        for (var i = 0; i < length; i++) {
            const toy = {
                name: _getRandomItem('name'),
                price: _getRandomItem('price'),
                labels: _getRandomItem('labels'),
                createdAt: new Date(),
                inStock: _getRandomItem('inStock'),
                color: _getRandomItem('color'),
                msgs: [],
            }
            await collection.insertOne(toy)
        }
    }
}

function _getRandomItem(type) {
    const toyNames = [
        "Talking Doll", "Tall Cowboy", "Race Car", "Action Figure", "Stuffed Bear",
        "Remote Helicopter", "Building Blocks", "Puzzle Box", "Water Gun", "Robot",
        "Stuffed Rabbit", "Toy Train", "Toy Soldier", "Toy Drum", "Toy Piano",
        "Toy Boat", "Bouncing Ball", "Toy Dinosaur", "Toy Castle", "Toy Spaceship"
    ]

    const labels = [
        "Doll", "Battery Powered", "Baby", "Educational", "Outdoor",
        "Collectible", "Soft", "Interactive", "Puzzle", "Remote Controlled",
        "Wooden", "Plastic", "Electronic", "Handcrafted", "Light-Up",
        "Musical", "Stuffed", "Ride-On", "Sports", "Creative"
    ]

    const colors = [
        "#E6E6FA",
        "#FFDAB9",
        "#98FB98",
        "#87CEEB",
        "#FFB6C1",
        "#FFFFE0",
        "#77DD77",
        "#ADD8E6",
        "#FFD1DC",
        "#F8DE7E"
    ]

    switch (type) {
        case "name":
            return toyNames[Math.floor(Math.random() * toyNames.length)]

        case "price":
            return Math.floor(Math.random() * (200 - 50 + 1)) + 50

        case "labels":
            let result = []
            let tempArray = [...labels]
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * tempArray.length)
                result.push(tempArray.splice(randomIndex, 1)[0])
            }
            return result

        case "inStock":
            return Math.random() < 0.5

        case "color":
            return colors[Math.floor(Math.random() * colors.length)]

        default:
            return null
    }
}


