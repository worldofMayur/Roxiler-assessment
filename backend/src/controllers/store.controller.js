import {
  getAllStores,
  findStoreById,
} from '../models/Store.js';

import {
  getAverageRatingForStore,
  getUserRatingForStore,
  upsertRating,
} from '../models/Rating.js';

// GET /api/stores  (USER ONLY)
export async function getStoresForUser(req, res, next) {
  try {
    const userId = req.user.id;

    const searchName = (req.query.searchName || '').toLowerCase();
    const searchAddress = (req.query.searchAddress || '').toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    let stores = await getAllStores();

    // Filtering
    if (searchName) {
      stores = stores.filter((s) =>
        s.name.toLowerCase().includes(searchName)
      );
    }
    if (searchAddress) {
      stores = stores.filter((s) =>
        (s.address || '').toLowerCase().includes(searchAddress)
      );
    }

    // Attach rating info
    const withRatings = await Promise.all(
      stores.map(async (s) => {
        const avgRating = await getAverageRatingForStore(s.id);
        const userRatingObj = await getUserRatingForStore(userId, s.id);

        return {
          id: s.id,
          name: s.name,
          email: s.email,
          address: s.address,
          overallRating: avgRating ? Number(avgRating.toFixed(1)) : 0,
          userRating: userRatingObj ? userRatingObj.rating : null,
        };
      })
    );

    const total = withRatings.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    const paged = withRatings.slice(start, start + pageSize);

    return res.json({
      stores: paged,
      page: safePage,
      pageSize,
      total,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings/:storeId  (USER ONLY)
export async function rateStore(req, res, next) {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5.',
      });
    }

    const store = await findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    await upsertRating(userId, storeId, rating);

    const updatedAvg = await getAverageRatingForStore(storeId);

    return res.json({
      message: 'Rating saved successfully.',
      updatedOverallRating: updatedAvg ? Number(updatedAvg.toFixed(1)) : 0,
    });
  } catch (err) {
    next(err);
  }
}
