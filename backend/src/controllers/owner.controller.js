import {
  getStoresByOwner,
  findStoreById,
  createStore,
  updateStore,
  deleteStore,
} from '../models/Store.js';
import {
  getAllRatings,
  getRatingsForStore,
  getAverageRatingForStore,
  deleteRatingsByStore,
} from '../models/Rating.js';
import { getAllUsers } from '../models/User.js';

// GET /api/owner/dashboard
export async function getOwnerDashboard(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stores = await getStoresByOwner(ownerId);
    const allRatings = await getAllRatings();

    const ownedStoreIds = new Set(stores.map((s) => s.id));
    const ratingsForOwnerStores = allRatings.filter((r) =>
      ownedStoreIds.has(r.store_id || r.storeId)
    );

    const totalStores = stores.length;
    const totalRatings = ratingsForOwnerStores.length;
    const averageRating =
      totalRatings === 0
        ? 0
        : ratingsForOwnerStores.reduce((sum, r) => sum + r.rating, 0) /
          totalRatings;

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
export async function getOwnerStoresSummary(req, res, next) {
  try {
    const ownerId = req.user.id;
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    const stores = await getStoresByOwner(ownerId);

    const storeSummariesAll = await Promise.all(
      stores.map(async (store) => {
        const ratings = await getRatingsForStore(store.id);
        const avg =
          ratings.length === 0
            ? 0
            : ratings.reduce((sum, r) => sum + r.rating, 0) /
              ratings.length;

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          ratingsCount: ratings.length,
          averageRating: avg,
        };
      })
    );

    const total = storeSummariesAll.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    const paged = storeSummariesAll.slice(start, start + pageSize);

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

// GET /api/owner/stores/:storeId/raters
export async function getStoreRaters(req, res, next) {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.storeId);

    const store = await findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    if (store.ownerId !== ownerId) {
      return res.status(403).json({ message: 'You do not own this store.' });
    }

    const ratings = await getRatingsForStore(storeId);
    const users = await getAllUsers();
    const usersById = new Map(users.map((u) => [u.id, u]));

    const raters = ratings.map((r) => {
      const u = usersById.get(r.user_id || r.userId);
      return {
        userId: r.user_id || r.userId,
        name: u?.name || 'Unknown user',
        email: u?.email || '',
        rating: r.rating,
        createdAt: r.created_at || r.createdAt,
        updatedAt: r.updated_at || r.updatedAt,
      };
    });

    const averageRating = (await getAverageRatingForStore(storeId)) ?? 0;

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

// POST /api/owner/stores
// Body: { name, email, address }
export async function createStoreOwner(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { name, email, address } = req.body;

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ message: 'Store name must be at least 3 characters.' });
    }

    const store = await createStore({ name, email, address, ownerId });
    return res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

// PUT /api/owner/stores/:storeId
// Body: { name, email, address }
export async function updateStoreOwner(req, res, next) {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.storeId);
    const { name, email, address } = req.body;

    const store = await findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    if (store.ownerId !== ownerId) {
      return res.status(403).json({ message: 'You do not own this store.' });
    }

    const updated = await updateStore({
      id: storeId,
      name,
      email,
      address,
      ownerId,
    });

    return res.json({ store: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/owner/stores/:storeId
export async function deleteStoreOwner(req, res, next) {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.storeId);

    const store = await findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    if (store.ownerId !== ownerId) {
      return res.status(403).json({ message: 'You do not own this store.' });
    }

    await deleteRatingsByStore(storeId);
    await deleteStore(storeId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
