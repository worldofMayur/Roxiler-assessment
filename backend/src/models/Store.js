// Simple in-memory Store model

let stores = [];
let nextId = 1;

// NOTE: ownerId === 2 is the default owner@example.com from User model seeding
function seedStores() {
  if (stores.length) return;

  stores.push({
    id: nextId++,
    name: 'Star Supermarket Central Branch',
    email: 'central@starsupermarket.com',
    address: 'Main Street 1, Downtown City',
    ownerId: 2,
  });

  stores.push({
    id: nextId++,
    name: 'Tech World Electronics Plaza',
    email: 'contact@techworld.com',
    address: 'Market Road 5, Tech District',
    ownerId: 2, // same owner, for demo
  });

  stores.push({
    id: nextId++,
    name: 'Fresh Farm Organic Foods',
    email: 'hello@freshfarm.com',
    address: 'Green Avenue 9, Garden Area',
    ownerId: null, // unassigned
  });
}

seedStores();

export function getAllStores() {
  return stores;
}

export function findStoreById(id) {
  return stores.find((s) => s.id === id);
}

export function createStore({ name, email, address, ownerId = null }) {
  const store = {
    id: nextId++,
    name,
    email,
    address,
    ownerId,
  };
  stores.push(store);
  return store;
}

export function getStoresByOwner(ownerId) {
  return stores.filter((s) => s.ownerId === ownerId);
}
