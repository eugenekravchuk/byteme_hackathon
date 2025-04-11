import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Location } from '../types';
import { MapPin, Info } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import LocationDetailsPanel from './LocationDetailsPanel';
import { Link } from 'react-router-dom';

const MapView = () => {
  const { locations, filters, accessibilityLevels, selectedLocation, setSelectedLocation } = useApp();
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  useEffect(() => {
    let filtered = [...locations];

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

    setFilteredLocations(filtered);
  }, [locations, filters]);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };
  
  const handlePlanRoute = () => {
    toast({
      title: "Route Planning",
      description: "Route planning will be implemented in the next version.",
    });
  };

  const getMarkerColor = (levelId: string) => {
    const level = accessibilityLevels.find(level => level.id === levelId);
    return level ? level.color : "#888888";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-grow rounded-lg border-2 border-muted bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-white p-4">
          <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center relative">
            <div className="text-lg text-muted-foreground flex flex-col items-center">
              <Info className="h-10 w-10 mb-2" />
              <p>Map would display here.</p>
              <p className="text-sm">In a real app, this would use MapBox or Google Maps.</p>
            </div>
            
            {filteredLocations.map((location) => (
              <div 
                key={location.id} 
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${(location.coordinates.lng - 30.52) * 800 + 50}%`, 
                  top: `${(location.coordinates.lat - 50.45) * 800 + 50}%` 
                }}
                onClick={() => handleSelectLocation(location)}
              >
                <div className="flex flex-col items-center">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: getMarkerColor(location.accessibilityLevel) }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="mt-1 px-2 py-1 bg-white rounded-md shadow-md text-xs font-medium">
                    {location.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handlePlanRoute} 
            variant="outline" 
            className="text-xs"
            disabled={!selectedLocation}
          >
            Plan Accessible Route
          </Button>
          
          {selectedLocation && (
            <Link to={`/location/${selectedLocation.id}`}>
              <Button className="text-xs">
                View Full Details
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <LocationDetailsPanel />
    </div>
  );
};

export default MapView;
