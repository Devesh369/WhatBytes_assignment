from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from .models import Restaurant, Sale
from django.views import View

class RestaurantView(View):
    def get(self, request):
        # Example query using Q objects
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        # Query for Italian or Mexican restaurants
        italian_mexican = Restaurant.objects.filter(
            Q(restaurant_type__iexact='Italian') | Q(restaurant_type__iexact='Mexican')
        )
        
        # Query for restaurants not opened in the last 30 days
        not_opened_recently = Restaurant.objects.filter(
            ~Q(date_opened__gte=thirty_days_ago)
        )
        
        # Query for restaurants that are either Italian/Mexican or opened in the last 30 days
        combined_query = Restaurant.objects.filter(
            Q(restaurant_type__iexact='Italian') | Q(restaurant_type__iexact='Mexican') | Q(date_opened__gte=thirty_days_ago)
        )
        
        # Prepare the response data
        response_data = {
            'italian_mexican': list(italian_mexican.values()),
            'not_opened_recently': list(not_opened_recently.values()),
            'combined_query': list(combined_query.values()),
        }
        
        return JsonResponse(response_data)