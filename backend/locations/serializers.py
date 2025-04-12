from rest_framework import serializers
from .models import Location, AccessibilityFeature, Review

class AccessibilityFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilityFeature
        fields = ['id', 'name']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']


class LocationSerializer(serializers.ModelSerializer):
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
