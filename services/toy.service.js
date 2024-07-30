import fs from 'fs'
import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'

export const toyService = { query, getById, remove, save }
var toys = utilService.readJsonFile('data/toy.json')
_createData()


function query(filterBy = {}) {
    let filteredToys = [...toys]
    if (filterBy.name) {
        filteredToys = filteredToys.filter(toy => toy.name.includes(filterBy.name))
    }
    if (filterBy.inStock) {
        if (filterBy.inStock === 'in') filteredToys = filteredToys.filter(toy => toy.inStock)
        else if (filterBy.inStock === 'out') filteredToys = filteredToys.filter(toy => !toy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length !== 0) {
        filteredToys = filteredToys.filter(toy =>
            filterBy.labels.some(label => toy.labels.includes(label)))
    }
    if (filterBy.sort) {
        switch (filterBy.sort) {
            case 'name':
                filteredToys = filteredToys.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'price':
                filteredToys = filteredToys.sort((a, b) => a.price - b.price)
                break
            case 'date':
                filteredToys = filteredToys.sort((a, b) => a.createdAt - b.createdAt)
                break
        }
    }
    return Promise.resolve(filteredToys)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('Cannot remove toy...')
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function getById(toyId) {
    const foundToy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(foundToy)
}

async function save(toyToSave) {
    if (toyToSave._id) {
        toys = toys.map(toy => {
            return toy._id === toyToSave._id ? toyToSave : toy
        })
    }
    else {
        toyToSave._id = utilService.makeId()
        toys.push(toyToSave)
    }
    await _saveToysToFile()
    return toyToSave
}

function _createData(length = 24) {
    if (!toys || toys.length === 0) {
        let newToys = []
        for (var i = 0; i < length; i++) {
            const toy = {
                _id: utilService.makeId(),
                name: _getRandomItem('name'),
                price: _getRandomItem('price'),
                labels: _getRandomItem('labels'),
                createdAt: new Date(),
                inStock: _getRandomItem('inStock'),
                color: _getRandomItem('color'),
            }
            newToys.push(toy)
        }
        toys = newToys
        _saveToysToFile()
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


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}