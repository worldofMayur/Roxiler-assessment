import { getAllStores } from '../models/Store.js';
import {
  getAverageRatingForStore,
  getUserRatingForStore,
} from '../models/Rating.js';

// GET /api/stores  (for normal user)
export async function getStoresForUser(req, res, next) {
  try {
    const userId = req.user.id;
    const searchName = (req.query.searchName || '').toLowerCase();
    const searchAddress = (req.query.searchAddress || '').toLowerCase();

    let stores = getAllStores();

    if (searchName) {
      stores = stores.filter((s) =>
        s.name.toLowerCase().includes(searchName)
      );
    }

    if (searchAddress) {
      stores = stores.filter((s) =>
        s.address.toLowerCase().includes(searchAddress)
      );
    }

    const result = stores.map((store) => {
      const overall = getAverageRatingForStore(store.id);
      const userRating = getUserRatingForStore(userId, store.id);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: overall ?? 0,
        userRating: userRating ? userRating.rating : null,
      };
    });

    return res.json({ stores: result });
  } catch (err) {
    next(err);
  }
}
