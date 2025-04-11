import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { AlertCircle, Star, MessageSquare, Pencil, X, ChevronRight, Check, Accessibility } from 'lucide-react';
import { Separator } from './ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const LocationDetailsPanel: React.FC = () => {
  const { 
    selectedLocation, 
    setSelectedLocation, 
    accessibilityFeatures, 
    accessibilityLevels,
    user,
    addReview,
    suggestAccessibilityChange
  } = useApp();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isEditingAccessibility, setIsEditingAccessibility] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [accessibilityComment, setAccessibilityComment] = useState('');
  const isMobile = useIsMobile();

  if (!selectedLocation) {
    return null;
  }

  const handleClosePanel = () => {
    setSelectedLocation(null);
  };

  const handleAddReview = () => {
    if (!selectedLocation) return;
    
    addReview(selectedLocation.id, {
      rating: reviewRating,
      comment: reviewComment
    });
    
    setIsAddingReview(false);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleOpenEditAccessibility = () => {
    if (!selectedLocation) return;
    
    setSelectedFeatures(selectedLocation.accessibilityFeatures);
    setSelectedLevel(selectedLocation.accessibilityLevel);
    setAccessibilityComment('');
    setIsEditingAccessibility(true);
  };

  const handleSaveAccessibility = () => {
    if (!selectedLocation) return;
    
    suggestAccessibilityChange(
      selectedLocation.id,
      selectedFeatures,
      selectedLevel,
      accessibilityComment
    );
    
    setIsEditingAccessibility(false);
  };

  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  const getAccessibilityLevel = () => {
    return accessibilityLevels.find(level => level.id === selectedLocation?.accessibilityLevel);
  };

  const level = getAccessibilityLevel();

  const renderStarRating = (rating: number) => {
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
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderFeatures = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {selectedLocation?.accessibilityFeatures.map((featureId) => {
          const feature = accessibilityFeatures.find((f) => f.id === featureId);
          if (!feature) return null;
          
          return (
            <div key={featureId} className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-accessible2" />
              <span className="text-sm">{feature.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={`fixed ${isMobile ? 'inset-0 bg-background/80' : 'right-0 top-16 bottom-0 w-80'} z-40 border-l shadow-xl bg-white transform transition-transform ${selectedLocation ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg truncate">{selectedLocation?.name}</h2>
            <Button variant="ghost" size="icon" onClick={handleClosePanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {/* Category */}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Category</span>
                <p>{selectedLocation?.category}</p>
              </div>
              
              {/* Address */}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <p>{selectedLocation?.address}</p>
              </div>
              
              {/* Accessibility Level */}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Accessibility Level</span>
                <div className="flex items-center mt-1">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: level?.color }}
                  />
                  <p>{level?.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{level?.description}</p>
              </div>
              
              {/* Accessibility Features */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Accessibility Features</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleOpenEditAccessibility}
                    className="h-8 text-xs"
                    disabled={!user}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    {user?.isSpecialAccess ? 'Edit' : 'Suggest'}
                  </Button>
                </div>
                <div className="mt-2">
                  {renderFeatures()}
                </div>
              </div>
              
              {/* Description */}
              {selectedLocation?.description && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Description</span>
                  <p className="text-sm">{selectedLocation?.description}</p>
                </div>
              )}
              
              {/* Rating */}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Rating</span>
                <div className="mt-1">
                  {renderStarRating(selectedLocation?.rating || 0)}
                </div>
              </div>
              
              <Separator />
              
              {/* Reviews */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Reviews</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsAddingReview(true)}
                    className="h-8 text-xs"
                    disabled={!user}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Add Review
                  </Button>
                </div>
                
                {selectedLocation?.reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">No reviews yet.</p>
                ) : (
                  <div className="space-y-3 mt-2">
                    {selectedLocation?.reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{review.userName}</span>
                          <div className="flex items-center">
                            {renderStarRating(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm mt-1">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    
                    {selectedLocation?.reviews.length > 2 && (
                      <Link to={`/location/${selectedLocation.id}`} className="block text-center text-blue-600 hover:underline text-sm">
                        View all {selectedLocation.reviews.length} reviews
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t p-4 space-y-2">
            <Link to={`/location/${selectedLocation.id}`} className="block w-full">
              <Button variant="outline" className="w-full">
                <ChevronRight className="h-4 w-4 mr-1" />
                View Full Details
              </Button>
            </Link>
            
            <Button className="w-full" onClick={() => alert("Directions feature will be implemented in the next version")}>
              <Accessibility className="h-4 w-4 mr-2" />
              Get Accessible Directions
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review for {selectedLocation?.name}</DialogTitle>
            <DialogDescription>
              Share your experience to help others with accessibility needs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= reviewRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share details about your accessibility experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingReview(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingAccessibility} onOpenChange={setIsEditingAccessibility}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {user?.isSpecialAccess ? 'Edit Accessibility Information' : 'Suggest Accessibility Changes'}
            </DialogTitle>
            <DialogDescription>
              {user?.isSpecialAccess 
                ? 'Update the accessibility features and level for this location.' 
                : 'Your suggestions will be reviewed by our accessibility experts.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">Accessibility Features</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {accessibilityFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-feature-${feature.id}`}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <Label
                      htmlFor={`edit-feature-${feature.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {feature.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">Accessibility Level</Label>
              <div className="grid grid-cols-1 gap-2">
                {accessibilityLevels.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`level-${level.id}`}
                      name="accessibilityLevel"
                      checked={selectedLevel === level.id}
                      onChange={() => setSelectedLevel(level.id)}
                      className="h-4 w-4 text-accessible border-gray-300 focus:ring-accessible2"
                    />
                    <Label
                      htmlFor={`level-${level.id}`}
                      className="text-sm font-normal cursor-pointer flex items-center"
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: level.color }}
                      />
                      {level.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {!user?.isSpecialAccess && (
              <div className="space-y-2">
                <Label htmlFor="comment">Additional Comments</Label>
                <Textarea
                  id="comment"
                  placeholder="Add any additional details about your suggestion..."
                  value={accessibilityComment}
                  onChange={(e) => setAccessibilityComment(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingAccessibility(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccessibility}>
              {user?.isSpecialAccess ? 'Save Changes' : 'Submit Suggestion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationDetailsPanel;
