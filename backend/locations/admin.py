from django.contrib import admin
from .models import Location, AccessibilityFeature, Review, AccessibilityLevel, Category, Proposition

admin.site.register(Location)
admin.site.register(AccessibilityFeature)
admin.site.register(Review)
admin.site.register(AccessibilityLevel)
admin.site.register(Category)
admin.site.register(Proposition)
