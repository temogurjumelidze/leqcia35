from django.urls import path
from .views import *

urlpatterns = [
    path('list/', CourseListView.as_view(), name='course-list'),
    path('create/', CourseCreateView.as_view(), name='course-create'),
    path('course/<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-details'),
    path('notify/', NotifyStudentApiView.as_view(), name='course-notify'),
]
