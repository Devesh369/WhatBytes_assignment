from django.core.management.base import BaseCommand
from django.db.models import Q, F
from restaurants.models import Restaurant, Sale
from django.db import connection

class Command(BaseCommand):
    help = 'Demonstrate advanced query filtering with Q objects and lookups'

    def handle(self, *args, **kwargs):
        # Query 1: Italian or Mexican restaurants
        italian_mexican_q = Q(restaurant_type__iexact='Italian') | Q(restaurant_type__iexact='Mexican')
        italian_mexican_restaurants = Restaurant.objects.filter(italian_mexican_q)
        self.print_query_results("Italian or Mexican Restaurants", italian_mexican_restaurants)

        # Query 2: Restaurants not opened in the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        not_opened_recently_q = ~Q(date_opened__gte=thirty_days_ago)
        not_opened_recently_restaurants = Restaurant.objects.filter(not_opened_recently_q)
        self.print_query_results("Restaurants Not Opened in Last 30 Days", not_opened_recently_restaurants)

        # Query 3: Italian/Mexican or opened in the last 30 days
        recently_opened_q = Q(date_opened__gte=thirty_days_ago)
        combined_q = italian_mexican_q | recently_opened_q
        combined_restaurants = Restaurant.objects.filter(combined_q)
        self.print_query_results("Italian/Mexican or Opened in Last 30 Days", combined_restaurants)

        # Query 4: Restaurants with names containing 'grill'
        grill_restaurants = Restaurant.objects.filter(name__icontains='grill')
        self.print_query_results("Restaurants with 'grill' in Name", grill_restaurants)

        # Query 5: Restaurants with names ending with 'Cafe'
        cafe_restaurants = Restaurant.objects.filter(name__endswith='Cafe')
        self.print_query_results("Restaurants Ending with 'Cafe'", cafe_restaurants)

        # Query 6: Sales where income is greater than expenditure or restaurant name contains digits
        sales_q = Q(income__gt=F('expenditure')) | Q(restaurant__name__regex=r'\d+')
        sales_with_conditions = Sale.objects.filter(sales_q).select_related('restaurant')
        self.print_query_results("Sales with Income Greater than Expenditure or Restaurant Name Contains Digits", sales_with_conditions)

    def print_query_results(self, title, queryset):
        self.stdout.write(f"\n{title}:")
        for obj in queryset:
            self.stdout.write(str(obj))
        self.stdout.write(f"SQL Query: {str(queryset.query)}")