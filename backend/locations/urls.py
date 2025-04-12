from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, AccessibilityFeatureViewSet, ReviewViewSet

router = DefaultRouter()
router.register('locations', LocationViewSet)
router.register('features', AccessibilityFeatureViewSet)
router.register('reviews', ReviewViewSet)

urlpatterns = router.urls
