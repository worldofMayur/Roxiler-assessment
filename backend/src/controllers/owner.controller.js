import { getStoresByOwner, findStoreById } from '../models/Store.js';
import {
  getAllRatings,
  getRatingsForStore,
  getAverageRatingForStore,
} from '../models/Rating.js';
import { getAllUsers } from '../models/User.js';

// GET /api/owner/dashboard
export function getOwnerDashboard(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stores = getStoresByOwner(ownerId);
    const allRatings = getAllRatings().filter((r) =>
      stores.some((s) => s.id === r.storeId)
    );

    const totalStores = stores.length;
    const totalRatings = allRatings.length;
    const averageRating =
      totalRatings === 0
        ? 0
        : allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return res.json({
      totalStores,
      totalRatings,
      averageRating,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/owner/stores
export function getOwnerStoresSummary(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stores = getStoresByOwner(ownerId);

    const storeSummaries = stores.map((store) => {
      const ratings = getRatingsForStore(store.id);
      const avg =
        ratings.length === 0
          ? 0
          : ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        ratingsCount: ratings.length,
        averageRating: avg,
      };
    });

    return res.json({ stores: storeSummaries });
  } catch (err) {
    next(err);
  }
}

// GET /api/owner/stores/:storeId/raters
export function getStoreRaters(req, res, next) {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.storeId);

    const store = findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    if (store.ownerId !== ownerId) {
      return res.status(403).json({ message: 'You do not own this store.' });
    }

    const ratings = getRatingsForStore(storeId);
    const users = getAllUsers();
    const usersById = new Map(users.map((u) => [u.id, u]));

    const raters = ratings.map((r) => {
      const u = usersById.get(r.userId);
      return {
        userId: r.userId,
        name: u?.name || 'Unknown user',
        email: u?.email || '',
        rating: r.rating,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    const averageRating = getAverageRatingForStore(storeId) ?? 0;

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
      },
      averageRating,
      raters,
    });
  } catch (err) {
    next(err);
  }
}
