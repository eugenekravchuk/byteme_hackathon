
import { AccessibilityFeature, AccessibilityLevel, Location, User } from "../types";

// Mock Accessibility Features
export const accessibilityFeatures: AccessibilityFeature[] = [
  { id: "1", name: "Ramp Access", icon: "wheelchair" },
  { id: "2", name: "Elevator", icon: "arrow-up-down" },
  { id: "3", name: "Accessible Toilet", icon: "toilet" },
  { id: "4", name: "Tactile Paths", icon: "footprints" },
  { id: "5", name: "Braille Signage", icon: "braille" },
  { id: "6", name: "Audio Guidance", icon: "sound" },
  { id: "7", name: "Accessible Parking", icon: "parking" },
  { id: "8", name: "Wide Doorways", icon: "door-open" },
  { id: "9", name: "Service Animals Welcome", icon: "dog" },
  { id: "10", name: "Low Counter", icon: "align-vertical-justify-center" },
];

// Mock Accessibility Levels
export const accessibilityLevels: AccessibilityLevel[] = [
  { 
    id: "1", 
    name: "Fully Accessible", 
    color: "#00A86B", 
    description: "Accessible for all types of disabilities with multiple accommodations" 
  },
  { 
    id: "2", 
    name: "Mostly Accessible", 
    color: "#0077CC", 
    description: "Most areas accessible but may have some limitations" 
  },
  { 
    id: "3", 
    name: "Partially Accessible", 
    color: "#F9B000", 
    description: "Some accessibility features but significant barriers remain" 
  },
  { 
    id: "4", 
    name: "Limited Accessibility", 
    color: "#DE3700", 
    description: "Few accommodations, major barriers for most disabled individuals" 
  },
];

// Location Categories
export const categories = [
  "Restaurant", 
  "Cafe", 
  "Park", 
  "Museum", 
  "Library", 
  "Cinema", 
  "Shopping Mall", 
  "Public Transport", 
  "Hospital", 
  "Educational Institution"
];

// Mock Locations
export const locations: Location[] = [
  {
    id: "1",
    name: "Central Library",
    address: "123 Main Street, City Center",
    category: "Library",
    description: "A modern public library with extensive accessibility features.",
    coordinates: {
      lat: 50.450001,
      lng: 30.523333
    },
    accessibilityFeatures: ["1", "2", "3", "5", "8"],
    accessibilityLevel: "1",
    rating: 4.8,
    reviews: [
      {
        id: "101",
        userId: "1",
        userName: "Alex Smith",
        rating: 5,
        comment: "Excellent accessibility features, including well-maintained ramps and elevators.",
        date: new Date("2023-08-15")
      },
      {
        id: "102",
        userId: "2",
        userName: "Maria Johnson",
        rating: 4.5,
        comment: "Great braille signage and helpful staff. Automatic doors work well.",
        date: new Date("2023-07-22")
      }
    ],
    images: ["/placeholder.svg"]
  },
  {
    id: "2",
    name: "Art Museum",
    address: "45 Culture Avenue, Arts District",
    category: "Museum",
    description: "The city's largest art museum with accessibility improvements.",
    coordinates: {
      lat: 50.451001,
      lng: 30.522333
    },
    accessibilityFeatures: ["1", "2", "3", "6", "7"],
    accessibilityLevel: "2",
    rating: 4.2,
    reviews: [
      {
        id: "103",
        userId: "3",
        userName: "David Lee",
        rating: 4,
        comment: "Audio descriptions for exhibits are very helpful, but some areas still have steps.",
        date: new Date("2023-09-05")
      }
    ],
    images: ["/placeholder.svg"]
  },
  {
    id: "3",
    name: "Riverfront Cafe",
    address: "78 River Street, Waterfront",
    category: "Cafe",
    description: "Cozy cafe with scenic views and some accessibility accommodations.",
    coordinates: {
      lat: 50.452001,
      lng: 30.524333
    },
    accessibilityFeatures: ["1", "8", "10"],
    accessibilityLevel: "3",
    rating: 3.5,
    reviews: [
      {
        id: "104",
        userId: "4",
        userName: "Sofia Garcia",
        rating: 3,
        comment: "Has a ramp but it's quite steep. Bathroom is not fully accessible.",
        date: new Date("2023-08-30")
      }
    ],
    images: ["/placeholder.svg"]
  },
  {
    id: "4",
    name: "City Park",
    address: "200 Green Avenue, North Side",
    category: "Park",
    description: "Large urban park with paved paths and accessible playgrounds.",
    coordinates: {
      lat: 50.453001,
      lng: 30.525333
    },
    accessibilityFeatures: ["4", "7", "9"],
    accessibilityLevel: "2",
    rating: 4.5,
    reviews: [
      {
        id: "105",
        userId: "5",
        userName: "James Wilson",
        rating: 4.5,
        comment: "Well-maintained tactile paths and good accessible parking options.",
        date: new Date("2023-09-10")
      }
    ],
    images: ["/placeholder.svg"]
  },
  {
    id: "5",
    name: "Star Cinema",
    address: "321 Entertainment Blvd, West Side",
    category: "Cinema",
    description: "Modern cinema with full accessibility features and services.",
    coordinates: {
      lat: 50.454001,
      lng: 30.526333
    },
    accessibilityFeatures: ["1", "2", "3", "6", "7", "8"],
    accessibilityLevel: "1",
    rating: 4.9,
    reviews: [
      {
        id: "106",
        userId: "6",
        userName: "Emma Thompson",
        rating: 5,
        comment: "Amazing accessibility! Audio description headsets, wheelchair spaces, and accessible restrooms all well maintained.",
        date: new Date("2023-09-15")
      }
    ],
    images: ["/placeholder.svg"]
  }
];

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "Alex Smith",
    email: "alex@example.com",
    isSpecialAccess: true
  },
  {
    id: "2",
    name: "Maria Johnson",
    email: "maria@example.com",
    isSpecialAccess: true
  },
  {
    id: "3",
    name: "David Lee",
    email: "david@example.com",
    isSpecialAccess: false
  },
  {
    id: "4",
    name: "Sofia Garcia",
    email: "sofia@example.com",
    isSpecialAccess: true
  }
];

export const currentUser: User = {
  id: "1",
  name: "Alex Smith",
  email: "alex@example.com",
  isSpecialAccess: false
};
