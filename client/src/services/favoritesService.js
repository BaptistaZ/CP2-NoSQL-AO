export function getFavorites(userId) {
  const favKey = `favorites_${userId}`;
  return JSON.parse(localStorage.getItem(favKey)) || [];
}

export function toggleFavorite(userId, movieId) {
  const favKey = `favorites_${userId}`;
  const current = getFavorites(userId);

  let updated;
  if (current.includes(movieId)) {
    updated = current.filter((id) => id !== movieId);
  } else {
    updated = [...current, movieId];
  }

  localStorage.setItem(favKey, JSON.stringify(updated));
  return updated;
}
