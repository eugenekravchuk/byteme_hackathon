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

  // Apply filters
  const filteredLocations = React.useMemo(() => {
    let filtered = [...apiLocations];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(location =>
        filters.categories.includes(location.category)
      );
    }

    if (filters.accessibilityFeatures.length > 0) {
      filtered = filtered.filter(location =>
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
          className={`h-3 w-3 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-xs">{rating.toFixed(1)}</span>
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
                <div className="flex justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.category}</p>
                    <div className="flex items-center text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{location.address}</span>
                    </div>
                    <div className="mt-2">
                      {renderStars(location.rating)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div
                      className="w-4 h-4 rounded-full mb-2"
                      style={{ backgroundColor: getAccessibilityColor(location.accessibilityLevel) }}
                    />
                    <div className="flex gap-2">
                      <Link to={`/location/${location.id}`}>
                        <Button size="sm" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
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
