import React from 'react';

export default function RatingStars({ value = 0 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span>
      {stars.map((s) => (
        <span key={s}>{s <= value ? '★' : '☆'}</span>
      ))}
    </span>
  );
}