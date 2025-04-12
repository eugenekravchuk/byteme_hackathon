
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  accessibilityFeatures,
  accessibilityLevels,
  categories,
  currentUser,
  locations as mockLocations,
  users as mockUsers
} from '../data/mockData';
import { AccessibilityFeature, AccessibilityLevel, Filter, Location, Review, User } from '../types';
import { toast } from '../hooks/use-toast';

interface AppContextType {
  user: User | null;
  locations: Location[];
  accessibilityFeatures: AccessibilityFeature[];
  accessibilityLevels: AccessibilityLevel[];
  categories: string[];
  filters: Filter;
  selectedLocation: Location | null;
  setUser: (user: User | null) => void;
  setFilters: (filters: Filter) => void;
  setSelectedLocation: (location: Location | null) => void;
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  addReview: (locationId: string, review: Omit<Review, 'id' | 'userId' | 'userName' | 'date'>) => void;
  suggestAccessibilityChange: (
    locationId: string,
    features: string[],
    accessibilityLevel: string,
    comment: string
  ) => void;
}

const initialFilters: Filter = {
  categories: [],
  accessibilityFeatures: [],
  accessibilityLevels: [],
  minRating: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(currentUser); // Auto-login for demo
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const addLocation = (location: Location) => {
    setLocations([...locations, location]);
    toast({
      title: "Location Added",
      description: `${location.name} has been successfully added.`,
    });
  };

  const updateLocation = (updatedLocation: Location) => {
    setLocations(
      locations.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );
    if (selectedLocation?.id === updatedLocation.id) {
      setSelectedLocation(updatedLocation);
    }
    toast({
      title: "Location Updated",
      description: `${updatedLocation.name} has been successfully updated.`,
    });
  };

  const addReview = (
    locationId: string,
    review: Omit<Review, 'id' | 'userId' | 'userName' | 'date'>
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      ...review,
      date: new Date(),
    };

    const updatedLocations = locations.map((location) => {
      if (location.id === locationId) {
        const updatedReviews = [...location.reviews, newReview];
        const totalRating =
          updatedReviews.reduce((sum, rev) => sum + rev.rating, 0) /
          updatedReviews.length;

        return {
          ...location,
          reviews: updatedReviews,
          rating: parseFloat(total),
        };
      }
      return location;
    });

    setLocations(updatedLocations);
    
    // Update selected location if it's the one being reviewed
    if (selectedLocation?.id === locationId) {
      const updatedLocation = updatedLocations.find((loc) => loc.id === locationId);
      if (updatedLocation) {
        setSelectedLocation(updatedLocation);
      }
    }

    toast({
      title: "Review Added",
      description: "Your review has been successfully submitted.",
    });
  };

  const suggestAccessibilityChange = (
    locationId: string,
    features: string[],
    accessibilityLevel: string,
    comment: string
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to suggest changes.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the suggestion to be reviewed
    // For our demo, we'll apply changes directly if the user has special access
    if (user.isSpecialAccess) {
      const updatedLocations = locations.map((location) => {
        if (location.id === locationId) {
          return {
            ...location,
            accessibilityFeatures: features,
            accessibilityLevel,
          };
        }
        return location;
      });

      setLocations(updatedLocations);
      
      if (selectedLocation?.id === locationId) {
        const updatedLocation = updatedLocations.find((loc) => loc.id === locationId);
        if (updatedLocation) {
          setSelectedLocation(updatedLocation);
        }
      }

      toast({
        title: "Accessibility Updated",
        description: "The accessibility information has been updated.",
      });
    } else {
      toast({
        title: "Suggestion Received",
        description: "Your suggestion has been submitted for review. Thank you!",
      });
    }
  };

  const value = {
    user,
    locations,
    accessibilityFeatures,
    accessibilityLevels,
    categories,
    filters,
    selectedLocation,
    setUser,
    setFilters,
    setSelectedLocation,
    addLocation,
    updateLocation,
    addReview,
    suggestAccessibilityChange,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
