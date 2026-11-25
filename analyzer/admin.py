from django.contrib import admin
from .models import ElectricityBill

@admin.register(ElectricityBill)
class ElectricityBillAdmin(admin.ModelAdmin):
    list_display = ("id", "units", "rate_per_unit", "total_amount", "created_at")
