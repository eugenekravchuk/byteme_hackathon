from rest_framework import viewsets
from .models import Location, AccessibilityFeature, Review
from .serializers import LocationSerializer, AccessibilityFeatureSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class AccessibilityFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccessibilityFeature.objects.all()
    serializer_class = AccessibilityFeatureSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
