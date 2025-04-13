// components/FeatureDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Feature = {
  id: number;
  name: string;
};

interface FeatureDialogProps {
  availableFeatures: Feature[];
  onConfirm: (featureId: number) => void;
}

export const FeatureDialog: React.FC<FeatureDialogProps> = ({
  availableFeatures,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(
    null
  );

  const handleConfirm = () => {
    if (selectedFeatureId !== null) {
      onConfirm(selectedFeatureId);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Add Feature
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Feature</DialogTitle>
        </DialogHeader>

        <Select onValueChange={(value) => setSelectedFeatureId(+value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a feature" />
          </SelectTrigger>
          <SelectContent>
            {availableFeatures.map((feature) => (
              <SelectItem key={feature.id} value={feature.id.toString()}>
                {feature.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter className="mt-4">
          <Button onClick={handleConfirm} disabled={selectedFeatureId === null}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
