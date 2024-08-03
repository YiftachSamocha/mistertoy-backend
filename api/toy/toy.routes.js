import express from 'express'
import { addToy, getToyById, getToys, removeToy, updateToy } from './toy.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
export const toyRoutes = express.Router()
toyRoutes.get('/', getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/',requireAuth , updateToy)
toyRoutes.delete('/:id',requireAuth, removeToy)