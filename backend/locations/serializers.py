from rest_framework import serializers
from .models import Location, AccessibilityFeature, Review, Category, AccessibilityLevel

class AccessibilityFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilityFeature
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class AccessibilityLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilityLevel
        fields = ['id', 'name']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']


class LocationSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    accessibility_levels = AccessibilityLevelSerializer(many=True, read_only=True)
    accessibility_features = AccessibilityFeatureSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image_url:
            url = obj.image_url.url
            if not url.startswith('http'):
                return "https://res.cloudinary.com/dh6sayhat/" + url
            return url
        return None
