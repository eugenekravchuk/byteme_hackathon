
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, ArrowLeft, MessageSquare, Pencil, Accessibility, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppProvider } from '../context/AppContext';

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    locations, 
    accessibilityFeatures, 
    accessibilityLevels,
    user,
    setSelectedLocation
  } = useApp();
  
  const [location, setLocation] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const foundLocation = locations.find(loc => loc.id === id);
      if (foundLocation) {
        setLocation(foundLocation);
        // Also set as selected location for the side panel integration
        setSelectedLocation(foundLocation);
      }
    }
    
    // Cleanup function
    return () => {
      setSelectedLocation(null);
    };
  }, [id, locations, setSelectedLocation]);
  
  if (!location) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Location not found</h1>
            <Link to="/">
              <Button>Back to Map</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const getAccessibilityLevel = () => {
    return accessibilityLevels.find(level => level.id === location.accessibilityLevel);
  };
  
  const level = getAccessibilityLevel();
  
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto p-4">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column - Main info */}
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
                  
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: level?.color }}
                  >
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
                    <p>{location.description || "No description available."}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Accessibility Information</h3>
                    <p className="text-muted-foreground mb-2">{level?.description}</p>
                    
                    <h4 className="font-medium mt-4 mb-2">Accessibility Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {location.accessibilityFeatures.map((featureId: string) => {
                        const feature = accessibilityFeatures.find((f) => f.id === featureId);
                        if (!feature) return null;
                        
                        return (
                          <div key={featureId} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-accessible2" />
                            <span>{feature.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => alert("Directions feature will be implemented in the next version")}>
                  <Accessibility className="h-4 w-4 mr-2" />
                  Get Accessible Directions
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Reviews */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Reviews</CardTitle>
                  <Link to={`/${location.id}/review`}>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Add Review
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {location.reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet.</p>
                    <p>Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {location.reviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const LocationDetailWithProvider = () => (
  <AppProvider>
    <LocationDetail />
  </AppProvider>
);

export default LocationDetailWithProvider;
