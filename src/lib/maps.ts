interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  distanceText: string;
  durationText: string;
}

export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteInfo | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn("Google Maps API key not configured");
    // Return estimated values for demo
    const straightLineDistance = calculateStraightLineDistance(origin, destination);
    return {
      distance: straightLineDistance,
      duration: Math.ceil(straightLineDistance * 3), // Rough estimate: 3 min per km
      distanceText: `${straightLineDistance.toFixed(1)} km`,
      durationText: `${Math.ceil(straightLineDistance * 3)} mins`,
    };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}&mode=driving`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance.value / 1000, // Convert meters to km
        duration: Math.ceil(element.duration.value / 60), // Convert seconds to minutes
        distanceText: element.distance.text,
        durationText: element.duration.text,
      };
    }

    throw new Error('Unable to calculate route');
  } catch (error) {
    console.error('Error calculating route:', error);
    // Fallback to straight-line distance
    const straightLineDistance = calculateStraightLineDistance(origin, destination);
    return {
      distance: straightLineDistance,
      duration: Math.ceil(straightLineDistance * 3),
      distanceText: `${straightLineDistance.toFixed(1)} km`,
      durationText: `${Math.ceil(straightLineDistance * 3)} mins`,
    };
  }
}

function calculateStraightLineDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDynamicPrice(
  basePrice: number,
  pricePerKm: number,
  distance: number
): number {
  return Number((basePrice + pricePerKm * distance).toFixed(2));
}
