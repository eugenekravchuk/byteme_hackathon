import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  accessibilityFeatures,
  accessibilityLevels,
  categories,
  locations as mockLocations,
} from "../data/mockData";
import {
  AccessibilityFeature,
  AccessibilityLevel,
  Filter,
  Location,
  Review,
  User,
} from "../types";
import { toast } from "../hooks/use-toast";
import { getUserProfile } from "../api/user";
import { register as registerApi } from "../api/auth";
import { login as loginApi } from "../api/auth";
import * as jwt_decode from "jwt-decode";

interface AppContextType {
  user: User | null;
  locations: Location[];
  userLoading: boolean;
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
  addReview: (
    locationId: string,
    review: Omit<Review, "id" | "userId" | "userName" | "date">
  ) => void;
  suggestAccessibilityChange: (
    locationId: string,
    features: string[],
    accessibilityLevel: string,
    comment: string
  ) => void;
  loginUser: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  registerUser: (
    username: string,
    password: string,
    email: string,
    csrfToken?: string
  ) => Promise<void>;
}

const initialFilters: Filter = {
  categories: [],
  accessibilityFeatures: [],
  accessibilityLevels: [],
  minRating: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setUserLoading(false);
      return;
    }

    try {
      const decoded: any = jwt_decode.jwtDecode(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUserLoading(false);
        return;
      }

      getUserProfile()
        .then((data) => {
          setUser({
            id: data.id.toString(),
            name: data.username,
            email: data.email,
            isSpecialAccess: data.is_special_user,
          });
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => {
          setUserLoading(false);
        });
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUserLoading(false);
    }
  }, []);

  const loginUser = async (accessToken: string, refreshToken: string) => {
    try {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const data = await getUserProfile();

      setUser({
        id: data.id.toString(),
        name: data.username,
        email: data.email,
        isSpecialAccess: data.is_special_user,
      });

      toast({
        title: "Welcome",
        description: `Logged in as ${data.username}`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Unable to load user information.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerUser = async (
    username: string,
    password: string,
    email: string,
    csrfToken?: string
  ) => {
    try {
      await registerApi(username, password, email, csrfToken);

      // Now login immediately after
      const tokens = await loginApi(username, password);
      await loginUser(tokens.access, tokens.refresh);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const addLocation = (location: Location) => {
    setLocations([...locations, location]);
    toast({
      title: "Location Added",
      description: `${location.name} has been successfully added.`,
    });
  };

  const updateLocation = (updatedLocation: Location) => {
    setLocations(
      locations.map((loc) =>
        loc.id === updatedLocation.id ? updatedLocation : loc
      )
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
    review: Omit<Review, "id" | "userId" | "userName" | "date">
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
          rating: parseFloat(totalRating.toFixed(1)),
        };
      }
      return location;
    });

    setLocations(updatedLocations);

    if (selectedLocation?.id === locationId) {
      const updatedLocation = updatedLocations.find(
        (loc) => loc.id === locationId
      );
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
        const updatedLocation = updatedLocations.find(
          (loc) => loc.id === locationId
        );
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
        description:
          "Your suggestion has been submitted for review. Thank you!",
      });
    }
  };

  const value: AppContextType = {
    user,
    userLoading,
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
    loginUser,
    logout,
    registerUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
