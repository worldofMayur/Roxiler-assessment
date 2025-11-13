// Simple in-memory Rating model

let ratings = [];
let nextId = 1;

export function upsertRating(userId, storeId, value) {
  const now = new Date().toISOString();
  let r = ratings.find(
    (rt) => rt.userId === userId && rt.storeId === storeId
  );

  if (r) {
    r.rating = value;
    r.updatedAt = now;
  } else {
    r = {
      id: nextId++,
      userId,
      storeId,
      rating: value,
      createdAt: now,
      updatedAt: now,
    };
    ratings.push(r);
  }

  return r;
}

export function getAverageRatingForStore(storeId) {
  const rs = ratings.filter((r) => r.storeId === storeId);
  if (!rs.length) return null;
  const sum = rs.reduce((acc, r) => acc + r.rating, 0);
  return sum / rs.length;
}

export function getUserRatingForStore(userId, storeId) {
  return (
    ratings.find((r) => r.userId === userId && r.storeId === storeId) || null
  );
}

export function getRatingsForStore(storeId) {
  return ratings.filter((r) => r.storeId === storeId);
}
