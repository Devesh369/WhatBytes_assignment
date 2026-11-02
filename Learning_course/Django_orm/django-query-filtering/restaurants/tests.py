from django.test import TestCase
from django.db.models import Q
from .models import Restaurant, Sale
from datetime import timedelta
from django.utils import timezone

class RestaurantModelTests(TestCase):

    def setUp(self):
        self.restaurant1 = Restaurant.objects.create(
            name="Italian Bistro",
            restaurant_type="Italian",
            date_opened=timezone.now() - timedelta(days=40)
        )
        self.restaurant2 = Restaurant.objects.create(
            name="Mexican Grill",
            restaurant_type="Mexican",
            date_opened=timezone.now() - timedelta(days=10)
        )
        self.restaurant3 = Restaurant.objects.create(
            name="Cafe Delight",
            restaurant_type="Cafe",
            date_opened=timezone.now() - timedelta(days=60)
        )
        self.sale1 = Sale.objects.create(
            restaurant=self.restaurant1,
            income=5000,
            expenditure=3000
        )
        self.sale2 = Sale.objects.create(
            restaurant=self.restaurant2,
            income=2000,
            expenditure=2500
        )

    def test_italian_or_mexican_restaurants(self):
        query = Q(restaurant_type__iexact='Italian') | Q(restaurant_type__iexact='Mexican')
        restaurants = Restaurant.objects.filter(query)
        self.assertIn(self.restaurant1, restaurants)
        self.assertIn(self.restaurant2, restaurants)
        self.assertNotIn(self.restaurant3, restaurants)

    def test_not_opened_in_last_30_days(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        query = ~Q(date_opened__gte=thirty_days_ago)
        restaurants = Restaurant.objects.filter(query)
        self.assertIn(self.restaurant3, restaurants)
        self.assertNotIn(self.restaurant1, restaurants)
        self.assertNotIn(self.restaurant2, restaurants)

    def test_italian_mexican_or_recently_opened(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        italian_mexican_q = Q(restaurant_type__iexact='Italian') | Q(restaurant_type__iexact='Mexican')
        recently_opened_q = Q(date_opened__gte=thirty_days_ago)
        query = italian_mexican_q | recently_opened_q
        restaurants = Restaurant.objects.filter(query)
        self.assertIn(self.restaurant1, restaurants)
        self.assertIn(self.restaurant2, restaurants)
        self.assertNotIn(self.restaurant3, restaurants)

    def test_name_contains_grill(self):
        query = Q(name__icontains='grill')
        restaurants = Restaurant.objects.filter(query)
        self.assertIn(self.restaurant2, restaurants)
        self.assertNotIn(self.restaurant1, restaurants)
        self.assertNotIn(self.restaurant3, restaurants)

    def test_name_ends_with_cafe(self):
        query = Q(name__endswith='Cafe')
        restaurants = Restaurant.objects.filter(query)
        self.assertIn(self.restaurant3, restaurants)
        self.assertNotIn(self.restaurant1, restaurants)
        self.assertNotIn(self.restaurant2, restaurants)

    def test_income_greater_than_expenditure(self):
        query = Q(income__gt=F('expenditure'))
        sales = Sale.objects.filter(query)
        self.assertIn(self.sale1, sales)
        self.assertNotIn(self.sale2, sales)

    def test_name_contains_numeric(self):
        query = Q(name__regex=r'\d+')
        restaurants = Restaurant.objects.filter(query)
        self.assertNotIn(self.restaurant1, restaurants)
        self.assertNotIn(self.restaurant2, restaurants)
        self.assertNotIn(self.restaurant3, restaurants)