from rest_framework.decorators import action
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Location, AccessibilityFeature, Review, Category, AccessibilityLevel, Proposition
from .serializers import LocationSerializer, AccessibilityFeatureSerializer, ReviewSerializer, CategorySerializer, AccessibilityLevelSerializer, PropositionSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Location, AccessibilityFeature


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        category_names = self.request.query_params.getlist('categories')
        if category_names:
            queryset = queryset.filter(categories__name__in=category_names).distinct()

        feature_names = self.request.query_params.getlist('accessibility_features')
        if feature_names:
            queryset = queryset.filter(accessibility_features__name__in=feature_names).distinct()

        min_rating = self.request.query_params.get('min_rating')
        if min_rating is not None:
            queryset = queryset.filter(rating__gte=min_rating)

        return queryset

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_feature_to_location(request, location_id, feature_id):
    try:
        location = Location.objects.get(id=location_id)
        feature = AccessibilityFeature.objects.get(id=feature_id)
        location.accessibility_features.add(feature)
        return Response({"message": "Feature added"}, status=status.HTTP_200_OK)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)
    except AccessibilityFeature.DoesNotExist:
        return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_feature_from_location(request, location_id, feature_id):
    try:
        location = Location.objects.get(id=location_id)
        feature = AccessibilityFeature.objects.get(id=feature_id)
        location.accessibility_features.remove(feature)
        return Response({"message": "Feature removed"}, status=status.HTTP_200_OK)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)
    except AccessibilityFeature.DoesNotExist:
        return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

class AccessibilityFeatureViewSet(viewsets.ModelViewSet): 
    queryset = AccessibilityFeature.objects.all()
    serializer_class = AccessibilityFeatureSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AccessibilityLevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccessibilityLevel.objects.all()
    serializer_class = AccessibilityLevelSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PropositionViewSet(viewsets.ModelViewSet):
    queryset = Proposition.objects.all()
    serializer_class = PropositionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)