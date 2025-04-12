from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, AccessibilityFeatureViewSet, ReviewViewSet, CategoryViewSet, AccessibilityLevelViewSet

router = DefaultRouter()
router.register('locations', LocationViewSet)
router.register('features', AccessibilityFeatureViewSet)
router.register('reviews', ReviewViewSet)
router.register('categories', CategoryViewSet)
router.register('accessibility_levels', AccessibilityLevelViewSet)

urlpatterns = router.urls
