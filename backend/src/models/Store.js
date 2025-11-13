// Simple in-memory Store model

let stores = [];
let nextId = 1;

function seedStores() {
  if (stores.length) return;

  stores.push({
    id: nextId++,
    name: 'Star Supermarket Central Branch',
    email: 'central@starsupermarket.com',
    address: 'Main Street 1, Downtown City',
    ownerId: null, // will be used later when we add store owners
  });

  stores.push({
    id: nextId++,
    name: 'Tech World Electronics Plaza',
    email: 'contact@techworld.com',
    address: 'Market Road 5, Tech District',
    ownerId: null,
  });

  stores.push({
    id: nextId++,
    name: 'Fresh Farm Organic Foods',
    email: 'hello@freshfarm.com',
    address: 'Green Avenue 9, Garden Area',
    ownerId: null,
  });
}

seedStores();

export function getAllStores() {
  return stores;
}

export function findStoreById(id) {
  return stores.find((s) => s.id === id);
}

// We’ll use this later for the admin "add store" feature
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
