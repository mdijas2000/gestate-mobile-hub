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

// High-demand area centers (example coordinates for major city centers)
const HIGH_DEMAND_AREAS = [
  { lat: 40.7128, lng: -74.0060, radius: 5 }, // New York
  { lat: 34.0522, lng: -118.2437, radius: 5 }, // Los Angeles
  { lat: 41.8781, lng: -87.6298, radius: 5 }, // Chicago
  // Add more high-demand coordinates as needed
];

export function calculateSurgeMultiplier(
  pickupCoords?: { lat: number; lng: number },
  currentTime: Date = new Date()
): number {
  let multiplier = 1.0;
  
  // Time-based surge (peak hours)
  const hour = currentTime.getHours();
  const isPeakMorning = hour >= 7 && hour < 9;
  const isPeakEvening = hour >= 17 && hour < 19;
  
  if (isPeakMorning || isPeakEvening) {
    multiplier += 0.5; // 50% surge during peak hours
  }
  
  // Location-based surge (high-demand areas)
  if (pickupCoords) {
    const isHighDemandArea = HIGH_DEMAND_AREAS.some(area => {
      const distance = calculateStraightLineDistance(pickupCoords, area);
      return distance <= area.radius;
    });
    
    if (isHighDemandArea) {
      multiplier += 0.3; // 30% surge in high-demand areas
    }
  }
  
  return Number(multiplier.toFixed(2));
}

export function calculateDynamicPrice(
  basePrice: number,
  pricePerKm: number,
  distance: number,
  surgeMultiplier: number = 1.0
): number {
  const baseAmount = basePrice + pricePerKm * distance;
  return Number((baseAmount * surgeMultiplier).toFixed(2));
}
