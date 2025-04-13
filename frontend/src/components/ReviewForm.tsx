import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewFormProps {
  locationId: number;
  locationName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, review: string) => void;
}

export const ReviewForm = ({
  locationId,
  locationName,
  isOpen,
  onClose,
  onSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReview("");
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      console.log(locationId);

      const response = await fetch(
        "https://access-compass-django.onrender.com/api/reviews/",
        // "http://127.0.0.1:8000/api/reviews/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            rating: rating,
            comment: review,
            location: locationId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit review");
      }

      toast.success("Review submitted successfully");
      if (onSubmit) onSubmit(rating, review);
      resetForm();
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Add review for {locationName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Share your experience to help others with accessibility needs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="font-medium">Rating</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={cn(
                    "cursor-pointer transition-colors",
                    (hoveredRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Your review</div>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details about your accessibility experience..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
