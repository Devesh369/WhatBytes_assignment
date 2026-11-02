from django.contrib import admin
from .models import Restaurant, Sale

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant_type', 'date_opened')
    search_fields = ('name', 'restaurant_type')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'income', 'expenditure')
    list_filter = ('restaurant',)