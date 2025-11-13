import { findStoreById } from '../models/Store.js';
import { upsertRating, getAverageRatingForStore } from '../models/Rating.js';

export async function submitRating(req, res, next) {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const value = Number(req.body.rating);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      return res.status(400).json({ message: 'Invalid store id.' });
    }

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    const store = findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const r = upsertRating(userId, storeId, value);
    const overall = getAverageRatingForStore(storeId);

    return res.json({
      message: 'Rating saved.',
      rating: r.rating,
      storeId,
      overallRating: overall ?? 0,
    });
  } catch (err) {
    next(err);
  }
}
