from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Location, AccessibilityFeature, Review
from .serializers import LocationSerializer, AccessibilityFeatureSerializer, ReviewSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]

class AccessibilityFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccessibilityFeature.objects.all()
    serializer_class = AccessibilityFeatureSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
