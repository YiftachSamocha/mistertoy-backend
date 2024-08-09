import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { addReview, getReviewById, getReviews, removeReview, updateReview } from './review.controller.js'
export const reviewRoutes = express.Router()
reviewRoutes.get('/', getReviews)
reviewRoutes.get('/:id', getReviewById)
reviewRoutes.post('/', requireAuth, addReview)
reviewRoutes.put('/', requireAuth, updateReview)
reviewRoutes.delete('/:id', requireAuth, removeReview)
