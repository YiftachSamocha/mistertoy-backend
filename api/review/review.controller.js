import { loggerService } from "../../services/logger.service.js";
import { reviewService } from "./review.service.js";

export async function getReviews(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
            toy: req.query.toy || '',
            user: req.query.user || '',
        }

        const reviews = await reviewService.query(filterBy)
        res.json(reviews)
    }
    catch (err) {
        loggerService.error('Cannot load reviews', err)
        res.status(400).send('Cannot load reviews')
    }
}


export async function getReviewById(req, res) {
    try {
        const { id } = req.params
        const foundReview = await reviewService.getById(id)
        res.json(foundReview)
    }
    catch (err) {
        loggerService.error('Cannot get review', err)
        res.status(400).send('Cannot get review')

    }
}

export async function updateReview(req, res) {
    try {
        const { ...review } = req.body
        const savedReview = await reviewService.update(review)
        res.json(savedReview)
    }
    catch (err) {
        loggerService.error('Cannot update review', err)
        res.status(400).send('Cannot update review')
    }
}

export async function addReview(req, res) {
    try {
        const { ...review } = req.body
        const savedReview = await reviewService.add(review)
        res.json(savedReview)
    }
    catch (err) {
        loggerService.error('Cannot add review', err)
        res.status(400).send('Cannot add review')
    }
}

export async function removeReview(req, res) {
    try {
        const { id } = req.params
        await reviewService.remove(id)
        res.send('Review has been deleted')
    }
    catch (err) {
        loggerService.error('Cannot remove review', err)
        res.status(400).send('Cannot remove review')
    }

}