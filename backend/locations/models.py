from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

class AccessibilityFeature(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AccessibilityLevel(models.Model):
    LEVEL_CHOICES = [
        ('fully_accessible', 'Fully Accessible'),
        ('mostly_accessible', 'Mostly Accessible'),
        ('partially_accessible', 'Partially Accessible'),
        ('limited_accessibility', 'Limited Accessibility'),
    ]
    
    name = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    color = models.CharField(max_length=7, default='#FFFFFF')

    def __str__(self):
        return self.name
        
class Location(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    accessibility_features = models.ManyToManyField(AccessibilityFeature, related_name="locations")
    image_url = CloudinaryField('image', blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name="locations")
    accessibility_levels = models.ManyToManyField(AccessibilityLevel, related_name="locations") 
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)

    def __str__(self):
        return self.name

    def calculate_accessibility_level(self):
        features_score = self.accessibility_features.count()
        categories_score = self.categories.count()
        total_score = features_score + categories_score
        if total_score >= 15:
            return 'fully_accessible'
        elif total_score >= 10:
            return 'mostly_accessible'
        elif total_score >= 5:
            return 'partially_accessible'
        else:
            return 'limited_accessibility'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        accessibility_level = self.calculate_accessibility_level()
        level, created = AccessibilityLevel.objects.get_or_create(name=accessibility_level)
        self.accessibility_levels.set([level])

class Review(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Proposition(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='propositions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposition by {self.user} on {self.location}"
