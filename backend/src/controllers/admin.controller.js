import { getAllUsers, findUserByEmail } from '../models/User.js';
import {
  getAllStores,
  createStore,
  updateStore,
} from '../models/Store.js';
import {
  getAllRatings,
  getAverageRatingForStore,
} from '../models/Rating.js';

// GET /api/admin/dashboard
export async function getAdminDashboard(req, res, next) {
  try {
    const users = await getAllUsers();
    const stores = await getAllStores();
    const ratings = await getAllRatings();

    return res.json({
      totalUsers: users.length,
      totalStores: stores.length,
      totalRatings: ratings.length,
    });
  } catch (err) {
    next(err);
  }
}

function includesInsensitive(value, search) {
  return value.toLowerCase().includes(search.toLowerCase());
}

// GET /api/admin/users
export async function listUsers(req, res, next) {
  try {
    let users = await getAllUsers();

    const { name, email, address, role, sortBy = 'name', order = 'asc' } =
      req.query;

    if (name) {
      users = users.filter((u) => includesInsensitive(u.name, name));
    }
    if (email) {
      users = users.filter((u) => includesInsensitive(u.email, email));
    }
    if (address) {
      users = users.filter((u) =>
        includesInsensitive(u.address || '', address)
      );
    }
    if (role) {
      users = users.filter(
        (u) => u.role.toLowerCase() === String(role).toLowerCase()
      );
    }

    const allowedSort = ['name', 'email', 'address', 'role'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const multiplier = order === 'desc' ? -1 : 1;

    users = [...users].sort((a, b) => {
      const av = (a[sortField] || '').toString().toLowerCase();
      const bv = (b[sortField] || '').toString().toLowerCase();
      if (av < bv) return -1 * multiplier;
      if (av > bv) return 1 * multiplier;
      return 0;
    });

    return res.json({ users });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores
export async function listStores(req, res, next) {
  try {
    let stores = await getAllStores();

    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

    if (name) {
      stores = stores.filter((s) => includesInsensitive(s.name, name));
    }
    if (email) {
      stores = stores.filter((s) => includesInsensitive(s.email || '', email));
    }
    if (address) {
      stores = stores.filter((s) =>
        includesInsensitive(s.address || '', address)
      );
    }

    const storesWithRating = await Promise.all(
      stores.map(async (s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        ownerId: s.ownerId,
        rating: (await getAverageRatingForStore(s.id)) ?? 0,
      }))
    );

    const allowedSort = ['name', 'email', 'address', 'rating'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const multiplier = order === 'desc' ? -1 : 1;

    storesWithRating.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * multiplier;
      }

      const sa = (av || '').toString().toLowerCase();
      const sb = (bv || '').toString().toLowerCase();
      if (sa < sb) return -1 * multiplier;
      if (sa > sb) return 1 * multiplier;
      return 0;
    });

    return res.json({ stores: storesWithRating });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores
// Body: { name, email, address, ownerEmail? }
export async function createStoreAdmin(req, res, next) {
  try {
    const { name, email, address, ownerEmail } = req.body;

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ message: 'Store name must be at least 3 characters.' });
    }

    let ownerId = null;
    if (ownerEmail) {
      const owner = await findUserByEmail(ownerEmail);
      if (!owner) {
        return res
          .status(400)
          .json({ message: 'Owner with this email not found.' });
      }
      if (owner.role !== 'OWNER') {
        return res
          .status(400)
          .json({ message: 'Selected user is not a store owner.' });
      }
      ownerId = owner.id;
    }

    const store = await createStore({ name, email, address, ownerId });
    return res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/stores/:storeId
// Body: { name, email, address, ownerEmail? }
export async function updateStoreAdmin(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);
    const { name, email, address, ownerEmail } = req.body;

    if (!storeId) {
      return res.status(400).json({ message: 'Store id is required.' });
    }

    let ownerId = null;
    if (ownerEmail) {
      const owner = await findUserByEmail(ownerEmail);
      if (!owner) {
        return res
          .status(400)
          .json({ message: 'Owner with this email not found.' });
      }
      if (owner.role !== 'OWNER') {
        return res
          .status(400)
          .json({ message: 'Selected user is not a store owner.' });
      }
      ownerId = owner.id;
    }

    const updated = await updateStore({
      id: storeId,
      name,
      email,
      address,
      ownerId,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    return res.json({ store: updated });
  } catch (err) {
    next(err);
  }
}
