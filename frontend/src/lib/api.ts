const BASE_URL = 'https://access-compass-django.onrender.com/api';

export async function fetchLocations() {
  const response = await fetch(`${BASE_URL}/locations/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch locations: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function fetchLocationById(id: string) {
    const response = await fetch(`${BASE_URL}/locations/${id}/`);
    if (!response.ok) throw new Error('Error fetching location');
    return response.json();
}

export async function fetchMyReviews(token: string) {
    const res = await fetch(`${BASE_URL}/users/me/reviews/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to load user reviews');
    return res.json(); // returns: [{ id, comment, rating, date, location: { id, name, category } }]
}

export async function updateLocationFeatures(locationId: string, featureIds: number[], token: string) {
  const response = await fetch(`https://access-compass-django.onrender.com/api/locations/${locationId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      accessibility_features: featureIds,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update features: ${response.status} ${errorText}`);
  }

  return await response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch categories: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function fetchAccessibilityFeatures() {
  const response = await fetch(`${BASE_URL}/features/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch accessibility features: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function fetchAccessibilityLevels() {
  const response = await fetch(`${BASE_URL}/accessibility_levels/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch accessibility levels: ${response.status} ${errorText}`);
  }
  return response.json();
}
