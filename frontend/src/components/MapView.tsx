import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Location } from '../types';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import LocationDetailsPanel from './LocationDetailsPanel';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';

// Fix for marker icon not showing
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = () => {
  const { locations, filters, accessibilityLevels, selectedLocation, setSelectedLocation } = useApp();
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<LatLngExpression[]>([]);

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
    setRoute((prev) => [...prev, [location.coordinates.lat, location.coordinates.lng]]);
  };

  const handlePlanRoute = () => {
    if (!selectedLocation) return;
    toast({
      title: "Route Planning",
      description: "Drawing route between selected locations (demo).",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-grow rounded-lg border-2 border-muted overflow-hidden">
        <MapContainer
          center={[49.8397, 24.0297]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.coordinates.lat, location.coordinates.lng]}
              eventHandlers={{ click: () => handleSelectLocation(location) }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{location.name}</strong>
                  <br />
                  Rating: {location.rating}
                </div>
              </Popup>
            </Marker>
          ))}

          {route.length > 1 && <Polyline positions={route} color="blue" />}
        </MapContainer>
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
