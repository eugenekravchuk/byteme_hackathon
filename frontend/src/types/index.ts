export interface User {
  id: string | number;
  name: string;
  email: string;
  isSpecialAccess: boolean;
}

export interface AccessibilityFeature {
  id: string;
  name: string;
  icon: string;
}

export interface AccessibilityLevel {
  id: string;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  accessibilityFeatures: string[];
  accessibilityLevel: string;
  rating: number;
  reviews: Review[];
  images?: string[];
}


export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Filter {
  categories: string[];
  accessibilityFeatures: string[];
  accessibilityLevels: string[];
  minRating: number;
}
