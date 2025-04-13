import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, MessageSquare, Accessibility, Check, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppProvider } from '../context/AppContext';
import { fetchLocationById, updateLocationFeatures } from '../lib/api';
import { ReviewForm } from '@/components/ReviewForm';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [isAddFeatureDialogOpen, setIsAddFeatureDialogOpen] = useState(false);
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] = useState<string[]>([]);

  const navigate = useNavigate();

  const token = user?.token || localStorage.getItem('token') || '';

  const handleAddReview = (rating: number, review: string) => {
    if (!location) return;
    addReview(location.id, { rating, comment: review });
    setIsReviewFormOpen(false);
  };

  const handleRemoveAccessibilityFeature = async (featureId: string) => {
    if (!location || !token) return;

    const updated = location.accessibilityFeatures.filter((f: any) => f.id !== featureId);

    try {
      const updatedResponse = await updateLocationFeatures(location.id, updated.map((f: any) => f.id), token);
      setLocation({ ...location, accessibilityFeatures: updatedResponse.accessibility_features || [] });
    } catch (err) {
      console.error('Failed to remove accessibility feature:', err);
    }
  };

  const handleSaveAccessibilityFeatures = async () => {
    if (!location || !token) return;

    const merged = Array.from(
      new Set([...location.accessibilityFeatures.map((f: any) => f.id), ...selectedAccessibilityFeatures])
    );

    try {
      const updatedResponse = await updateLocationFeatures(location.id, merged, token);
      setLocation((prev: any) => ({
        ...prev,
        accessibilityFeatures: updatedResponse.accessibility_features || [],
      }));
      setIsAddFeatureDialogOpen(false);
      setSelectedAccessibilityFeatures([]);
    } catch (err) {
      console.error('Failed to update accessibility features:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLocationById(id)
        .then((loc) => {
          setLocation({
            ...loc,
            reviews: Array.isArray(loc.reviews) ? loc.reviews : [],
            accessibilityFeatures: Array.isArray(loc.accessibility_features) ? loc.accessibility_features : [],
            accessibilityLevel: loc.accessibility_levels?.[0]?.id || '',
          });
          setSelectedLocation(loc);
        })
        .catch((err) => {
          console.error('Failed to load location:', err);
        });
    }
    return () => {
      setSelectedLocation(null);
    };
  }, [id, setSelectedLocation]);

  const getAccessibilityLevel = () =>
    accessibilityLevels.find((level) => level.id === location.accessibilityLevel);

  const renderStarRating = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-lg font-medium">{Number(rating).toFixed(1)}</span>
    </div>
  );

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

  const level = getAccessibilityLevel();

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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{location.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location.address}
                    </CardDescription>
                  </div>
                  <Badge className="text-white" style={{ backgroundColor: level?.color }}>
                    {level?.name}
                  </Badge>
                </div>
                <div className="mt-4">{renderStarRating(location.rating)}</div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p>{location.description || 'No description available.'}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mt-4 mb-2">Accessibility Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.isArray(location.accessibilityFeatures) &&
                        location.accessibilityFeatures.map((feature: any) => (
                          <div key={feature.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-accessible2" />
                              <span>{feature.name}</span>
                            </div>
                            {user?.isSpecialAccess && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveAccessibilityFeature(feature.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                    {user?.isSpecialAccess && (
                      <div className="mt-4">
                        <Dialog open={isAddFeatureDialogOpen} onOpenChange={setIsAddFeatureDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" /> Add Feature
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Accessibility Features</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {accessibilityFeatures.map((feature) => (
                                <div key={feature.id} className="flex items-center gap-2">
                                  <Checkbox
                                    id={feature.id}
                                    checked={selectedAccessibilityFeatures.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      setSelectedAccessibilityFeatures((prev) =>
                                        checked ? [...prev, feature.id] : prev.filter((id) => id !== feature.id)
                                      );
                                    }}
                                  />
                                  <label htmlFor={feature.id} className="text-sm">{feature.name}</label>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsAddFeatureDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveAccessibilityFeatures}>Save</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => alert('Directions feature will be implemented in the next version')}>
                  <Accessibility className="h-4 w-4 mr-2" />
                  Get Accessible Directions
                </Button>
              </CardFooter>
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
