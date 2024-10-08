import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { addUser, getUserById, getUsers, removeUser, updateUser } from './user.controller.js'
export const userRoutes = express.Router()
userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUserById)
userRoutes.post('/', addUser)
userRoutes.put('/', updateUser)
userRoutes.delete('/:id',requireAuth, removeUser)
