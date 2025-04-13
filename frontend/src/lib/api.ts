const BASE_URL = "https://access-compass-django.onrender.com/api";

export async function fetchLocations() {
  const response = await fetch(`${BASE_URL}/locations/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch locations: ${response.status} ${errorText}`
    );
  }
  return response.json();
}

export async function fetchLocationById(id: string) {
  const response = await fetch(`${BASE_URL}/locations/${id}/`);
  if (!response.ok) throw new Error("Error fetching location");
  return response.json();
}

export async function fetchMyReviews(token: string) {
  const res = await fetch(`${BASE_URL}/users/me/reviews/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load user reviews");
  return res.json(); // returns: [{ id, comment, rating, date, location: { id, name, category } }]
}

export async function updateLocationFeatures(
  locationId: string,
  featureIds: number[],
  token: string
) {
  const response = await fetch(
    `https://access-compass-django.onrender.com/api/locations/${locationId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accessibility_features: featureIds,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update features: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch categories: ${response.status} ${errorText}`
    );
  }
  return response.json();
}

export async function fetchAccessibilityFeatures() {
  const response = await fetch(`${BASE_URL}/features/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch accessibility features: ${response.status} ${errorText}`
    );
  }
  return response.json();
}

export async function fetchAccessibilityLevels() {
  const response = await fetch(`${BASE_URL}/accessibility_levels/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch accessibility levels: ${response.status} ${errorText}`
    );
  }
  return response.json();
}

export const addFeatureToLocation = async (
  locationId: number,
  featureId: number,
  token: string
) => {
  const response = await fetch(
    `${BASE_URL}/locations/${locationId}/add-feature/${featureId}/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add feature");
  }
};

export const removeFeatureFromLocation = async (
  locationId: number,
  featureId: number,
  token: string
) => {
  const response = await fetch(
    `${BASE_URL}/locations/${locationId}/remove-feature/${featureId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to remove feature");
  }
};

export const fetchPropositions = async () => {
  const response = await fetch(`${BASE_URL}/propositions/`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch accessibility levels: ${response.status} ${errorText}`
    );
  }
  return response.json();
};

export const postProposition = async (
  locationId: string,
  comment: string,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/propositions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: comment, location: locationId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to post proposition: ${response.status} ${errorText}`
    );
  }

  return response.json();
};
