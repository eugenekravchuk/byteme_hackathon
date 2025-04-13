from rest_framework.decorators import action
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Location, AccessibilityFeature, Review, Category, AccessibilityLevel, Proposition
from .serializers import LocationSerializer, AccessibilityFeatureSerializer, ReviewSerializer, CategorySerializer, AccessibilityLevelSerializer, PropositionSerializer

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
    
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def add_feature(self, request, pk=None):
        location = self.get_object()
        feature_id = request.data.get("feature_id")
        try:
            feature = AccessibilityFeature.objects.get(id=feature_id)
            location.accessibility_features.add(feature)
            return Response({"detail": "Feature added."})
        except AccessibilityFeature.DoesNotExist:
            return Response({"detail": "Feature not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def remove_feature(self, request, pk=None):
        location = self.get_object()
        feature_id = request.data.get("feature_id")
        try:
            feature = AccessibilityFeature.objects.get(id=feature_id)
            location.accessibility_features.remove(feature)
            return Response({"detail": "Feature removed."})
        except AccessibilityFeature.DoesNotExist:
            return Response({"detail": "Feature not found."}, status=status.HTTP_404_NOT_FOUND)

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