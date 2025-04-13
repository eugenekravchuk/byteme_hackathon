import React, { useEffect, useState } from 'react';
import Spinner from './ui/spinner';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchLocations } from '../lib/api';

const LocationList = () => {
  const { filters, accessibilityLevels, setSelectedLocation } = useApp();
  const [apiLocations, setApiLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations()
      .then(setApiLocations)
      .catch((err) => {
        console.error('Failed to fetch locations in component', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredLocations = React.useMemo(() => {
    let filtered = [...apiLocations];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(location =>
        Array.isArray(location.categories) &&
        location.categories.some((category: any) =>
          filters.categories.includes(category.id)
        )
      );
    }

    if (filters.accessibilityFeatures.length > 0) {
      filtered = filtered.filter(location =>
        Array.isArray(location.accessibility_features) &&
        filters.accessibilityFeatures.every((featureId) =>
          location.accessibility_features.some((f: any) => f.id === featureId)
        )
      );
    }

    if (filters.accessibilityLevels.length > 0) {
      filtered = filtered.filter(location =>
        Array.isArray(location.accessibility_levels) &&
        location.accessibility_levels.some((level: any) =>
          filters.accessibilityLevels.includes(level.id)
        )
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(location => Number(location.rating) >= filters.minRating);
    }

    return filtered;
  }, [apiLocations, filters]);

  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location);
  };

  const getAccessibilityColor = (levels: any[]) => {
    if (!Array.isArray(levels) || levels.length === 0) return "#888888";
    return levels[0]?.color || "#888888";
  };

  const getAccessibilityName = (levels: any[]) => {
    if (!Array.isArray(levels) || levels.length === 0) return "Unknown";
    return levels[0]?.name || "Unknown";
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{Number(rating).toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Locations</h2>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <Spinner />
        ) : filteredLocations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No locations match your current filters.
          </div>
        ) : (
          <ul className="divide-y">
            {filteredLocations.map((location) => (
              <li key={location.id} className="p-4 hover:bg-gray-50">
                <div className="flex gap-4">
                  <img
                    src={location.image_url || '/placeholder.jpg'}
                    alt={location.name}
                    className="w-32 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getAccessibilityColor(location.accessibility_levels) }}
                        title={getAccessibilityName(location.accessibility_levels)}
                      />
                      <h3 className="text-base font-semibold">{location.name}</h3>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location.address}
                    </div>
                    <div className="mt-2">
                      {renderStars(location.rating)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Link to={`/location/${location.id}`}>
                      <Button size="sm" className="text-xs">Details</Button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationList;
