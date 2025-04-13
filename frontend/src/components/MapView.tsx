import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Location } from '../types';
import { Button } from './ui/button';
import LocationDetailsPanel from './LocationDetailsPanel';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { fetchLocations } from '../lib/api';
import L from 'leaflet';
import "leaflet-routing-machine";

const MapView = () => {
  const { filters, setSelectedLocation } = useApp();
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [routeControls, setRouteControls] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);


  useEffect(() => {
    fetchLocations()
      .then((locations) => {
        setAllLocations(locations);

        let filtered = [...locations];

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

        setFilteredLocations(filtered);
      })
      .catch((err) => console.error('Failed to fetch locations:', err));
  }, [filters]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          if (mapInstance) {
            mapInstance.setView([position.coords.latitude, position.coords.longitude], 13);
          }
        },
        (error) => {
          console.error('Error getting geolocation: ', error);
        }
      );
    }
  }, [mapInstance]);

  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const handlePlanRoute = () => {
    if (!userLocation || filteredLocations.length === 0 || !mapInstance || !mapReady) return;

    routeControls.forEach((control) => control.remove());


    const newRouteControls = filteredLocations.map((location) => {
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(location.latitude, location.longitude),
        ],
        createMarker: () => null,
        routeWhileDragging: true,
        alternatives: false,
        showAlternatives: false,
      });

      routeControl.addTo(mapInstance);

      return routeControl;
    });

    setRouteControls(newRouteControls);
  };


  const renderMap = () => (
    <MapContainer
      whenReady={(event) => { 
        const map = event.target;
        setMapInstance(map);
        setMapReady(true);
      }}
      center={[49.8397, 24.0297]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredLocations.map((location) =>
        location.latitude && location.longitude ? (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => handleSelectLocation(location),
            }}
          >
            <Popup>
              <strong>{location.name}</strong><br />
              Rating: {location.rating}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-grow rounded-lg border-2 border-muted overflow-hidden z-0">
        {renderMap()}
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
            disabled={!userLocation || filteredLocations.length === 0 || !mapReady}
          >
            Plan Accessible Route
          </Button>
        </div>
      </div>

      <LocationDetailsPanel />
    </div>
  );
};

export default MapView;
