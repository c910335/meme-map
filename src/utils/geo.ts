import { MemeItem } from '../types/meme';

/**
 * Calculate the great circle distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance into a human-friendly string (e.g. "450 公尺", "2.2 公里", "182 公里")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} 公尺`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} 公里`;
  }
  return `${Math.round(distanceKm)} 公里`;
}

/**
 * Find the nearest meme to the given coordinate
 */
export function findNearestMeme(
  userCoord: [number, number],
  memes: MemeItem[]
): { meme: MemeItem; distanceKm: number } | null {
  if (memes.length === 0) return null;

  let nearestMeme = memes[0];
  let minDistance = calculateDistanceKm(userCoord, nearestMeme.coordinates);

  for (let i = 1; i < memes.length; i++) {
    const dist = calculateDistanceKm(userCoord, memes[i].coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearestMeme = memes[i];
    }
  }

  return { meme: nearestMeme, distanceKm: minDistance };
}
