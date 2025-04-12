from django.db import models
from django.conf import settings

class AccessibilityFeature(models.Model):
    name = models.CharField(max_length=100)  # e.g., "Ramp", "Subtitles", "Braille signs"

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    accessibility_features = models.ManyToManyField(AccessibilityFeature, related_name="locations")

    def __str__(self):
        return self.name


class Review(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()  # 1 to 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
