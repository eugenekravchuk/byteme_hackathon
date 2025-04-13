import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchAccessibilityFeatures } from "../lib/api";
import {
  accessibilityLevels as mockAccessibilityLevels,
  categories as mockCategories,
  locations as mockLocations,
} from "../data/mockData";
import {
  AccessibilityFeature,
  AccessibilityLevel,
  Category,
  Filter,
  Location,
  Review,
  User,
} from "../types";
import { getUserProfile } from "../api/user";
import { login as loginApi, register as registerApi } from "../api/auth";
import * as jwt_decode from "jwt-decode";
import { toast } from "../hooks/use-toast";

const initialFilters: Filter = {
  categories: [],
  accessibilityFeatures: [],
  accessibilityLevels: [],
  minRating: 0,
};

interface AppContextType {
  user: User | null;
  userLoading: boolean;
  locations: Location[];
  accessibilityFeatures: AccessibilityFeature[];
  accessibilityLevels: AccessibilityLevel[];
  categories: Category[];
  filters: Filter;
  selectedLocation: Location | null;
  setUser: (user: User | null) => void;
  setFilters: (filters: Filter) => void;
  setSelectedLocation: (location: Location | null) => void;
  setCategories: (categories: Category[]) => void;
  setAccessibilityFeatures: (features: AccessibilityFeature[]) => void;
  setAccessibilityLevels: (levels: AccessibilityLevel[]) => void;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<
    AccessibilityFeature[]
  >([]);
  const [accessibilityLevels, setAccessibilityLevels] = useState<
    AccessibilityLevel[]
  >(mockAccessibilityLevels);

  // --- Load accessibility features once ---
  useEffect(() => {
    fetchAccessibilityFeatures()
      .then(setAccessibilityFeatures)
      .catch((err) => console.error("Failed to load features", err));
  }, []);

  // --- Load user profile if token exists ---
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return setUserLoading(false);

    try {
      const decoded: any = jwt_decode.jwtDecode(accessToken);
      if (decoded.exp * 1000 < Date.now()) throw new Error("Token expired");

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
        .finally(() => setUserLoading(false));
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUserLoading(false);
    }
  }, []);

  // --- User Actions ---
  const loginUser = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    const data = await getUserProfile();
    setUser({
      id: data.id.toString(),
      name: data.username,
      email: data.email,
      isSpecialAccess: data.is_special_user,
    });

    toast({ title: "Welcome", description: `Logged in as ${data.username}` });
  };

  const registerUser = async (
    username: string,
    password: string,
    email: string
  ) => {
    await registerApi(username, password, email);
    const tokens = await loginApi(username, password);
    await loginUser(tokens.access, tokens.refresh);
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

  // --- Location Updates ---
  const addLocation = (location: Location) => {
    setLocations([...locations, location]);
    toast({
      title: "Location Added",
      description: `${location.name} has been added.`,
    });
  };

  const updateLocation = (updated: Location) => {
    const updatedList = locations.map((loc) =>
      loc.id === updated.id ? updated : loc
    );
    setLocations(updatedList);
    if (selectedLocation?.id === updated.id) setSelectedLocation(updated);
    toast({
      title: "Location Updated",
      description: `${updated.name} has been updated.`,
    });
  };

  // --- Reviews ---
  const addReview = (
    locationId: string,
    review: Omit<Review, "id" | "userId" | "userName" | "date">
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Login required to add a review",
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
        const newReviews = [...location.reviews, newReview];
        const newRating =
          newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...location,
          reviews: newReviews,
          rating: +newRating.toFixed(1),
        };
      }
      return location;
    });

    setLocations(updatedLocations);
    if (selectedLocation?.id === locationId) {
      setSelectedLocation(
        updatedLocations.find((loc) => loc.id === locationId) || null
      );
    }

    toast({ title: "Review Added", description: "Thanks for your feedback!" });
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
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    if (user.isSpecialAccess) {
      const updated = locations.map((loc) =>
        loc.id === locationId
          ? { ...loc, accessibilityFeatures: features, accessibilityLevel }
          : loc
      );
      setLocations(updated);
      if (selectedLocation?.id === locationId) {
        setSelectedLocation(
          updated.find((loc) => loc.id === locationId) || null
        );
      }
      toast({ title: "Accessibility Updated", description: "Changes saved." });
    } else {
      toast({
        title: "Suggestion Submitted",
        description: "We'll review it soon.",
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
    setCategories,
    setAccessibilityFeatures,
    setAccessibilityLevels,
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
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
