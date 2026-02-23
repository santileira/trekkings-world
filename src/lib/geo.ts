/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type TrekWithCoordinates = {
  _id: string;
  coordinates?: { lat: number; lng: number };
  [key: string]: any;
};

/**
 * Sort treks by proximity to a target location
 * @returns sorted array with distance property added
 */
export function sortByProximity<T extends TrekWithCoordinates>(
  treks: T[],
  targetLat: number,
  targetLng: number,
  limit: number = 3
): (T & { distanceKm: number })[] {
  return treks
    .filter((trek) => trek.coordinates?.lat && trek.coordinates?.lng)
    .map((trek) => ({
      ...trek,
      distanceKm: calculateDistance(
        targetLat,
        targetLng,
        trek.coordinates!.lat,
        trek.coordinates!.lng
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
