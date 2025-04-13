import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchLocations } from '../lib/api';

const LocationList = () => {
  const { filters, accessibilityLevels, setSelectedLocation } = useApp();
  const [apiLocations, setApiLocations] = useState<any[]>([]);

  useEffect(() => {
    fetchLocations()
      .then(setApiLocations)
      .catch((err) => {
        console.error('Failed to fetch locations in component', err);
      });
  }, []);

  const filteredLocations = React.useMemo(() => {
    let filtered = [...apiLocations];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(location =>
        filters.categories.includes(location.category)
      );
    }

    if (filters.accessibilityFeatures.length > 0) {
      filtered = filtered.filter(location =>
        Array.isArray(location.accessibilityFeatures) &&
        filters.accessibilityFeatures.every(featureId =>
          location.accessibilityFeatures.includes(featureId)
        )
      );
    }

    if (filters.accessibilityLevels.length > 0) {
      filtered = filtered.filter(location =>
        filters.accessibilityLevels.includes(location.accessibilityLevel)
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(location => location.rating >= filters.minRating);
    }

    return filtered;
  }, [apiLocations, filters]);

  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location);
  };

  const getAccessibilityColor = (levelId: string) => {
    const level = accessibilityLevels.find(level => level.id === levelId);
    return level ? level.color : "#888888";
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
        <h2 className="font-semibold">Locations ({filteredLocations.length})</h2>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {filteredLocations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No locations match your current filters.
          </div>
        ) : (
          <ul className="divide-y">
            {filteredLocations.map((location) => (
              <li key={location.id} className="p-4 hover:bg-gray-50">
                <div className="flex gap-4">
                  {/* Image */}
                  <img
                    src={location.image_url || '/placeholder.jpg'}
                    alt={location.name}
                    className="w-32 h-20 object-cover rounded-md border"
                  />

                  <div className="flex-1 pr-4">
                    {/* Title + circle */}
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getAccessibilityColor(location.accessibilityLevel) }}
                        title={location.accessibilityLevel}
                      />
                      <h3 className="text-base font-semibold">{location.name}</h3>
                    </div>

                    {/* Address */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location.address}
                    </div>

                    {/* Stars */}
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
