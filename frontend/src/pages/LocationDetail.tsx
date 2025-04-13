import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/button";
import Spinner from "../components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  ArrowLeft,
  MessageSquare,
  Accessibility,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppProvider } from "../context/AppContext";
import {
  addFeatureToLocation,
  fetchAccessibilityFeatures,
  fetchLocationById,
  fetchLocations,
  postProposition,
  removeFeatureFromLocation,
  fetchPropositions,
} from "../lib/api";
import { ReviewForm } from "@/components/ReviewForm";

import L from "leaflet";
import "leaflet-routing-machine";
import { AttributionControl } from "react-leaflet";
import { toast } from "../hooks/use-toast";
import { FeatureDialog } from "../components/FeatureDialog";

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    accessibilityFeatures,
    accessibilityLevels,
    user,
    setSelectedLocation,
    addReview,
  } = useApp();

  const [location, setLocation] = useState<any>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [routeControl, setRouteControl] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [changeReview, setChangeReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [propositions, setPropositions] = useState<any[]>([]);
  const [newProposition, setNewProposition] = useState("");

  const navigate = useNavigate();

  const handleAddReview = (rating: number, review: string) => {
    if (!location) return;
    addReview(location.id, { rating, comment: review });
    setIsReviewFormOpen(false);
    window.location.reload();
  };

  const handleRemoveFeature = async (featureId: number) => {
    if (!location) return;
    try {
      const token = localStorage.getItem("access_token")!;
      await removeFeatureFromLocation(location.id, featureId, token);
      const updated = location.accessibilityFeatures.filter(
        (f: any) => f.id !== featureId
      );
      setLocation({ ...location, accessibilityFeatures: updated });
      toast({
        title: "Feature removed",
      });
    } catch (err: any) {
      toast({
        title: "Failed to remove feature",
      });
    }
  };

  useEffect(() => {
    if (id && user?.isSpecialAccess) {
      fetchPropositions() // returns all propositions
        .then((data) => {
          const filtered = data.filter(
            (p: any) => String(p.location) === String(id) // or p.location.id === Number(id)
          );
          setPropositions(filtered);
        })
        .catch((err) => console.error("Failed to fetch propositions", err));
    }
  }, [id, user]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchLocationById(id)
        .then((loc) => {
          setLocation({
            ...loc,
            reviews: Array.isArray(loc.reviews) ? loc.reviews : [],
            accessibilityFeatures: Array.isArray(loc.accessibility_features)
              ? loc.accessibility_features
              : [],
            accessibilityLevel: loc.accessibility_levels?.[0]?.id || "",
          });
          setSelectedLocation(loc);
        })
        .catch((err) => {
          console.error("Failed to load location:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    return () => {
      setSelectedLocation(null);
    };
  }, [id, setSelectedLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          setUserLocation({
            lat: userLat,
            lng: userLng,
          });

          const destinationLat = location.latitude;
          const destinationLng = location.longitude;

          const leafletMap = L.map("map", {
            center: [destinationLat, destinationLng],
            zoom: 10,
            scrollWheelZoom: true,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(leafletMap);

          setMap(leafletMap);

          if (location && location.latitude && location.longitude) {
            L.marker([destinationLat, destinationLng])
              .addTo(leafletMap)
              .bindPopup(location.name || "Destination")
              .openPopup();
          }
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          setUserLocation(null);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(null);
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <Spinner />
        </main>
      </div>
    );
  } else {
    console.log(propositions);
  }

  if (!location) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Location not found</h1>
            <Button onClick={() => navigate("/")}>Back to Map</Button>
          </div>
        </main>
      </div>
    );
  }

  const getAccessibilityLevel = () => {
    return accessibilityLevels.find(
      (level) => level.id === location.accessibilityLevel
    );
  };

  const level = getAccessibilityLevel();

  const renderStarRating = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-lg font-medium">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );

  const handleGetDirections = () => {
    if (!userLocation || !location || !map) return;

    if (!routeControl) {
      const newRouteControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(location.latitude, location.longitude),
        ],
        createMarker: () => null,
        routeWhileDragging: true,
      }).addTo(map);

      setRouteControl(newRouteControl);
    } else {
      routeControl.setWaypoints([
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(location.latitude, location.longitude),
      ]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto p-4">
        <div className="mb-6">
          <Button onClick={() => navigate("/")}>Back to Map</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex gap-4">
                  <img
                    src={location.image_url}
                    alt={location.name}
                    className="w-32 h-24 object-cover rounded-xl border"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {location.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {location.address}
                        </CardDescription>
                      </div>
                      {/* Rounded accessibility badge */}
                      <div
                        className="w-4 h-4 rounded-full mt-1"
                        style={{ backgroundColor: level?.color || "gray" }}
                        title={level?.name}
                      />
                    </div>
                    <div className="mt-4">
                      {renderStarRating(location.rating)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p>{location.description || "No description available."}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mt-4 mb-2">
                      Accessibility Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.isArray(location.accessibilityFeatures) &&
                        location.accessibilityFeatures.map((feature: any) => (
                          <div
                            key={feature.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-accessible2" />
                              <span>{feature.name}</span>
                            </div>
                            {user?.isSpecialAccess && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveFeature(feature.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                    {user?.isSpecialAccess && (
                      <div className="mt-4">
                        <FeatureDialog
                          availableFeatures={accessibilityFeatures.filter(
                            (f) =>
                              !location.accessibilityFeatures.some(
                                (af: any) => af.id === f.id
                              )
                          )}
                          onConfirm={async (featureId) => {
                            try {
                              const token =
                                localStorage.getItem("access_token")!;
                              await addFeatureToLocation(
                                location.id,
                                featureId,
                                token
                              );
                              const newFeature = accessibilityFeatures.find(
                                (f) => f.id === featureId
                              );
                              if (newFeature) {
                                setLocation({
                                  ...location,
                                  accessibilityFeatures: [
                                    ...location.accessibilityFeatures,
                                    newFeature,
                                  ],
                                });
                              }
                              window.location.reload();
                            } catch (err) {
                              toast({ title: "Failed to add feature" });
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleGetDirections}>
                  <Accessibility className="h-4 w-4 mr-2" />
                  Get Accessible Directions
                </Button>
              </CardFooter>
              <div
                id="map"
                style={{ height: "400px", width: "100%", zIndex: 0 }}
              ></div>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Reviews</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReviewFormOpen(true)}
                    className="h-8 text-xs"
                    disabled={!user}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Add Review
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {Array.isArray(location.reviews) &&
                location.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {location.reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet.</p>
                    <p>Be the first to share your experience!</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Propositions</CardTitle>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {/* 🔒 SHOW LIST ONLY IF isSpecialAccess */}
                {user?.isSpecialAccess && (
                  <>
                    {propositions.length > 0 ? (
                      <div className="space-y-4 mb-6">
                        {propositions.map((prop) => (
                          <div
                            key={prop.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{prop.text}</span>
                            </div>
                            <p className="mt-2">{prop.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No propositions yet.</p>
                        <p>Be the first to suggest something helpful!</p>
                      </div>
                    )}
                  </>
                )}

                {/* ✍️ SUGGESTION FORM IS ALWAYS VISIBLE TO LOGGED-IN USERS */}
                {user && (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-3 border rounded-md"
                      rows={3}
                      placeholder="Suggest an improvement..."
                      value={newProposition}
                      onChange={(e) => setNewProposition(e.target.value)}
                    />
                    <Button
                      className="mt-2"
                      disabled={!newProposition.trim()}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("access_token")!;
                          const newProp = await postProposition(
                            id,
                            newProposition,
                            token
                          );
                          if (user.isSpecialAccess) {
                            setPropositions([...propositions, newProp]);
                          }
                          setNewProposition("");
                          toast({ title: "Proposition submitted" });
                        } catch (err) {
                          toast({
                            title: "Error",
                            description: "Could not submit your proposition.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Submit Proposition
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ReviewForm
        locationId={id}
        locationName={location.name}
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSubmit={handleAddReview}
      />
    </div>
  );
};

const LocationDetailWithProvider = () => (
  <AppProvider>
    <LocationDetail />
  </AppProvider>
);

export default LocationDetailWithProvider;
