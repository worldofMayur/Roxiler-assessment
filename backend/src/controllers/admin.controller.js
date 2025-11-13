import { getAllUsers } from '../models/User.js';
import { getAllStores } from '../models/Store.js';
import { getAllRatings, getAverageRatingForStore } from '../models/Rating.js';

// GET /api/admin/dashboard
export function getAdminDashboard(req, res, next) {
  try {
    const users = getAllUsers();
    const stores = getAllStores();
    const ratings = getAllRatings();

    return res.json({
      totalUsers: users.length,
      totalStores: stores.length,
      totalRatings: ratings.length,
    });
  } catch (err) {
    next(err);
  }
}

// helper for string filters + lowercase search
function includesInsensitive(value, search) {
  return value.toLowerCase().includes(search.toLowerCase());
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
export function listUsers(req, res, next) {
  try {
    let users = getAllUsers();

    const { name, email, address, role, sortBy = 'name', order = 'asc' } =
      req.query;

    if (name) {
      users = users.filter((u) => includesInsensitive(u.name, name));
    }
    if (email) {
      users = users.filter((u) => includesInsensitive(u.email, email));
    }
    if (address) {
      users = users.filter((u) => includesInsensitive(u.address || '', address));
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

    const sanitized = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
    }));

    return res.json({ users: sanitized });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
export function listStores(req, res, next) {
  try {
    let stores = getAllStores();

    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

    if (name) {
      stores = stores.filter((s) => includesInsensitive(s.name, name));
    }
    if (email) {
      stores = stores.filter((s) => includesInsensitive(s.email, email));
    }
    if (address) {
      stores = stores.filter((s) =>
        includesInsensitive(s.address || '', address)
      );
    }

    const storesWithRating = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: getAverageRatingForStore(s.id) ?? 0,
    }));

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
