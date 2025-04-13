import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/button";
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
import { fetchLocationById, fetchLocations } from "../lib/api";
import { ReviewForm } from "@/components/ReviewForm";

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

  const navigate = useNavigate();

  const handleAddReview = (rating: number, review: string) => {
    if (!location) return;
    addReview(location.id, { rating, comment: review });
    setIsReviewFormOpen(false);
  };

  const handleRemoveFeature = (featureId: string) => {
    if (!location) return;
    const updatedFeatures = location.accessibilityFeatures.filter(
      (f: any) => f.id !== featureId
    );
    setLocation({ ...location, accessibilityFeatures: updatedFeatures });
  };

  const handleAddFeature = () => {
    alert("Feature editing will be implemented.");
  };

  useEffect(() => {
    if (id) {
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
        });
    }
    return () => {
      setSelectedLocation(null);
    };
  }, [id, setSelectedLocation]);

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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddFeature}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Feature
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    alert(
                      "Directions feature will be implemented in the next version"
                    )
                  }
                >
                  <Accessibility className="h-4 w-4 mr-2" />
                  Get Accessible Directions
                </Button>
              </CardFooter>
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
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
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
          </div>
        </div>
      </main>

      <ReviewForm
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
