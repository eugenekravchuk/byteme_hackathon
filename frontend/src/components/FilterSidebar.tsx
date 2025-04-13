import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Slider } from './ui/slider';
import { Filter, Badge } from 'lucide-react';
import { fetchCategories, fetchAccessibilityFeatures, fetchAccessibilityLevels } from '../lib/api';

const FilterSidebar = () => {
  const {
    accessibilityFeatures,
    accessibilityLevels,
    categories,
    filters,
    setFilters,
    setCategories,
    setAccessibilityFeatures,
    setAccessibilityLevels,
  } = useApp();

  useEffect(() => {
    fetchCategories()
      .then((fetched) => setCategories(fetched))
      .catch((err) => console.error('Failed to fetch categories:', err));

    fetchAccessibilityFeatures()
      .then((fetched) => setAccessibilityFeatures(fetched))
      .catch((err) => console.error('Failed to fetch features:', err));

    fetchAccessibilityLevels()
      .then((fetched) => setAccessibilityLevels(fetched))
      .catch((err) => console.error('Failed to fetch levels:', err));
  }, [setCategories, setAccessibilityFeatures, setAccessibilityLevels]);

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    setFilters({ ...filters, categories: updatedCategories });
  };

  const handleFeatureChange = (featureId: string) => {
    const updatedFeatures = filters.accessibilityFeatures.includes(featureId)
      ? filters.accessibilityFeatures.filter((id) => id !== featureId)
      : [...filters.accessibilityFeatures, featureId];

    setFilters({ ...filters, accessibilityFeatures: updatedFeatures });
  };

  const handleLevelChange = (levelId: string) => {
    const updatedLevels = filters.accessibilityLevels.includes(levelId)
      ? filters.accessibilityLevels.filter((id) => id !== levelId)
      : [...filters.accessibilityLevels, levelId];

    setFilters({ ...filters, accessibilityLevels: updatedLevels });
  };

  const handleRatingChange = (value: number[]) => {
    setFilters({ ...filters, minRating: value[0] });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      accessibilityFeatures: [],
      accessibilityLevels: [],
      minRating: 0,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-xs"
        >
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="categories">
          <AccordionTrigger className="py-2">
            <span className="flex items-center">
              <Badge className="h-4 w-4 mr-2" />
              Categories
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {categories.map((category: any) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="py-2">
            <span className="flex items-center">
              <Badge className="h-4 w-4 mr-2" />
              Accessibility Features
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {accessibilityFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={filters.accessibilityFeatures.includes(feature.id)}
                    onCheckedChange={() => handleFeatureChange(feature.id)}
                  />
                  <Label
                    htmlFor={`feature-${feature.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="levels">
          <AccordionTrigger className="py-2">
            <span className="flex items-center">
              <Badge className="h-4 w-4 mr-2" />
              Accessibility Levels
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {accessibilityLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.id}`}
                    checked={filters.accessibilityLevels.includes(level.id)}
                    onCheckedChange={() => handleLevelChange(level.id)}
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="py-2">
            <span className="flex items-center">
              <Badge className="h-4 w-4 mr-2" />
              Minimum Rating
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[filters.minRating]}
                max={5}
                step={0.5}
                value={[filters.minRating]}
                onValueChange={handleRatingChange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.minRating} stars</span>
                <span>5 stars</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
