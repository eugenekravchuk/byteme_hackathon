
import React from 'react';
import { useApp } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Star, MapPin, Eye, Trash2 } from 'lucide-react';
import { AppProvider } from '../context/AppContext';

const MyReviews = () => {
  const { user, locations, setSelectedLocation } = useApp();
  
  // Get all reviews by the current user
  const myReviews = React.useMemo(() => {
    if (!user) return [];
    
    const reviews = [];
    
    for (const location of locations) {
      const userReviews = location.reviews.filter(review => review.userId === user.id);
      
      for (const review of userReviews) {
        reviews.push({
          ...review,
          locationId: location.id,
          locationName: location.name,
          locationCategory: location.category
        });
      }
    }
    
    // Sort by newest first
    reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return reviews;
  }, [user, locations]);

  const handleViewLocation = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      window.location.href = '/';
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">My Reviews</h2>
            <p className="text-center py-8 text-muted-foreground">
              Please sign in to view your reviews.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
        
        {myReviews.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-muted-foreground mb-4">
              You haven't reviewed any locations yet.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Explore Locations
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {myReviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{review.locationName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{review.locationCategory}</span>
                    </div>
                  </div>
                  <div>
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm">"{review.comment}"</p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => handleViewLocation(review.locationId)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Location
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const MyReviewsWithProvider = () => (
  <AppProvider>
    <MyReviews />
  </AppProvider>
);

export default MyReviewsWithProvider;
