"""
URL configuration for digi_world project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path  # <--- Tambahkan re_path
from django.views.generic import TemplateView   # <--- Tambahkan TemplateView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from api.views import EmailOrUsernameTokenView


def favicon_view(_: object) -> HttpResponse:
  """
  Sederhana: menghindari error TemplateDoesNotExist saat browser meminta /favicon.ico
  ketika React build (index.html) belum tersedia.
  """
  return HttpResponse(status=204)


urlpatterns = [
    # 1. Admin dan API Routes (Biarkan di atas)
    path('admin/', admin.site.urls),
    path('api/token/', EmailOrUsernameTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('api.urls')),
    # Tangani favicon secara eksplisit supaya tidak jatuh ke TemplateView index.html
    path('favicon.ico', favicon_view, name='favicon'),
]

if settings.DEBUG:
    # Serve uploaded media files (e.g. profile images) in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 2. React Frontend Integration (WAJIB DI PALING BAWAH)
# Pola ini menangkap URL apa saja yang tidak dikenali di atas
# dan mengirimkannya ke index.html milik React
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
